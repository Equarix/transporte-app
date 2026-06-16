import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Destination } from '../destination/entities/destination.entity';
import { Bus } from '../bus/entities/bus.entity';
import { Profile } from '../user/entities/profile.entity';
import { UserAgency } from '../auth/entities/user-agency.entity';
import { Agency } from '../agency/entities/agency.entity';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientProxy,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(UserAgency)
    private readonly userAgencyRepository: Repository<UserAgency>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) {}

  async getSalesReport() {
    // 1. Fetch raw report from the sales microservice
    const reportData = await firstValueFrom(
      this.paymentClient.send('getSalesReport', {}),
    );

    if (!reportData) {
      return null;
    }

    // 2. Fetch gateway database collections to resolve names (avoiding N+1 queries)
    const destinations = await this.destinationRepository.find();
    const destMap = new Map(destinations.map((d) => [d.destinationId, d]));

    const profiles = await this.profileRepository.find();
    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    const buses = await this.busRepository.find();
    const busMap = new Map(buses.map((b) => [b.busId, b]));

    // 3. Map/enrich recent transactions with human-readable information
    const enrichedRecentSales = (reportData.recentSales || []).map((sale: any) => {
      const origin = destMap.get(sale.fromDestinationId)?.name || 'Origen';
      const dest = destMap.get(sale.toDestinationId)?.name || 'Destino';
      
      // Get the customer name from the profile relation or salePayer
      let customerName = sale.salePayer?.names || 'Cliente';
      if (sale.userId) {
        const profile = profileMap.get(sale.userId);
        if (profile) {
          customerName = `${profile.firstName} ${profile.lastName}`;
        }
      }

      // Determine class or model from the bus
      let busClass = 'Ejecutivo';
      if (sale.saleDetails && sale.saleDetails.length > 0) {
        const detailBusId = sale.saleDetails[0].busId;
        const bus = busMap.get(detailBusId);
        if (bus) {
          busClass = bus.type || bus.model || 'Ejecutivo';
        }
      }

      // Total amount for this transaction (sum of its saleDetails amounts)
      const totalAmount = (sale.saleDetails || []).reduce(
        (sum: number, det: any) => sum + (det.amount || 0),
        0,
      );

      return {
        saleId: sale.saleId,
        bookingId: `#IT-${String(sale.saleId).padStart(5, '0')}`,
        route: `${origin} → ${dest}`,
        busClass,
        customer: customerName,
        status: sale.status,
        date: sale.createdAt,
        amount: totalAmount,
      };
    });

    return {
      totalRevenue: reportData.totalRevenue,
      ticketsSold: reportData.ticketsSold,
      growthRate: reportData.growthRate,
      occupancyRate: reportData.occupancyRate,
      trends: reportData.trends,
      recentSales: enrichedRecentSales,
    };
  }

  async getPointsReport() {
    interface RawTopMember {
      userId: number;
      pointBalance: number;
      status: string;
      velocity: string;
    }

    interface RawPointsReport {
      totalIssued: number;
      totalRedeemed: number;
      activeMembers: number;
      accumulationRate: number;
      redemptionRate: number;
      topMembers: RawTopMember[];
    }

    // 1. Fetch raw report from the sales microservice
    const reportData = await firstValueFrom<RawPointsReport>(
      this.paymentClient.send('getPointsReport', {}),
    );

    if (!reportData) {
      return null;
    }

    // 2. Fetch gateway database profiles to resolve names/emails
    const profiles = await this.profileRepository.find();
    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    // 3. Map/enrich top members
    const enrichedTopMembers = (reportData.topMembers || []).map((member) => {
      const profile = profileMap.get(member.userId);
      const customerName = profile 
        ? `${profile.firstName} ${profile.lastName}` 
        : `Usuario #${member.userId}`;
      const email = profile?.email || 'sin-correo@entrafesa.pe';

      return {
        userId: member.userId,
        customer: customerName,
        email,
        pointBalance: member.pointBalance,
        status: member.status,
        velocity: member.velocity,
      };
    });

    return {
      totalIssued: reportData.totalIssued,
      totalRedeemed: reportData.totalRedeemed,
      activeMembers: reportData.activeMembers,
      accumulationRate: reportData.accumulationRate,
      redemptionRate: reportData.redemptionRate,
      topMembers: enrichedTopMembers,
    };
  }

  async getSalesAgentReport() {
    interface AgencyMetric {
      agencyId: number;
      ticketsSold: number;
      totalSales: number;
      conversionRate: number;
    }

    interface RawAgentReport {
      agencyMetrics: AgencyMetric[];
    }

    // 1. Fetch raw agency sales statistics from sales microservice
    const rawData = await firstValueFrom<RawAgentReport>(
      this.paymentClient.send('getSalesAgentReport', {}),
    );

    if (!rawData) {
      return null;
    }

    // 2. Fetch UserAgencies, profiles, and agencies from Gateway DB to map sellers
    const userAgencies = await this.userAgencyRepository.find({
      relations: {
        user: {
          profile: true,
        },
        agency: true,
      },
    });

    const metricsMap = new Map(rawData.agencyMetrics.map((m) => [m.agencyId, m]));

    // Map/distribute agency metrics to corresponding employees/sellers
    const agents = userAgencies
      .filter((ua) => ua.user && ua.user.role === 'seller')
      .map((ua) => {
        const profile = ua.user.profile;
        const agency = ua.agency;
        const name = profile 
          ? `${profile.firstName} ${profile.lastName}` 
          : `Agente #${ua.user.userId}`;
        const email = profile?.email || 'vendedor@entrafesa.pe';
        const terminalName = agency?.name || 'Terminal Entrafesa';

        const metrics = metricsMap.get(agency?.agencyId || 0) || {
          ticketsSold: 0,
          totalSales: 0,
          conversionRate: 70.0,
        };

        // Calculate commission: 2.5% of total sales + $500 bonus if sales > 25000
        const baseComm = metrics.totalSales * 0.025;
        const bonus = metrics.totalSales > 25000 ? 500 : 0;
        const commission = baseComm + bonus;

        const status = metrics.totalSales >= 15000 ? 'ON TRACK' : 'REVIEW';

        return {
          userId: ua.user.userId,
          name,
          email,
          terminalName,
          tickets: metrics.ticketsSold,
          convRate: metrics.conversionRate,
          totalSales: metrics.totalSales,
          commission,
          status,
        };
      });

    // Sort agents by revenue/totalSales descending
    agents.sort((a, b) => b.totalSales - a.totalSales);

    // Calculate overall KPIs
    const totalSalesRevenue = agents.reduce((sum, a) => sum + a.totalSales, 0);
    const totalTicketsSold = agents.reduce((sum, a) => sum + a.tickets, 0);
    const totalCommission = agents.reduce((sum, a) => sum + a.commission, 0);
    const avgCommission = agents.length > 0 ? totalCommission / agents.length : 0;
    
    // Overall conversion is the average of active agents conversion rates
    const avgConversion = agents.length > 0 
      ? agents.reduce((sum, a) => sum + a.convRate, 0) / agents.length 
      : 68.4;

    return {
      totalSalesRevenue,
      ticketsSold: totalTicketsSold,
      avgCommission,
      conversionRate: Math.round(avgConversion * 10) / 10,
      agents,
    };
  }

  async getAgencyReport() {
    interface RawAgencyMetric {
      agencyId: number;
      ticketsSold: number;
      totalSales: number;
      conversionRate: number;
    }

    interface RawAgencyReport {
      agencyMetrics: RawAgencyMetric[];
    }

    // 1. Fetch raw agency metrics from sales microservice
    const rawData = await firstValueFrom<RawAgencyReport>(
      this.paymentClient.send('getAgencyReport', {}),
    );

    if (!rawData) {
      return null;
    }

    // 2. Fetch agencies from gateway database to resolve names/locations
    const agencies = await this.agencyRepository.find();
    const metricsMap = new Map(rawData.agencyMetrics.map((m) => [m.agencyId, m]));

    const getTarget = (name: string) => {
      const n = name.toUpperCase();
      if (n.includes('TRUJILLO')) return 110000;
      if (n.includes('CHICLAYO')) return 70000;
      if (n.includes('PIURA')) return 40000;
      if (n.includes('CHIMBOTE')) return 150000;
      if (n.includes('LIMA')) return 130000;
      return 30000;
    };

    // 3. Map agency data
    const mappedAgencies = agencies.map((agency) => {
      const metrics = metricsMap.get(agency.agencyId) || {
        ticketsSold: 0,
        totalSales: 0,
        conversionRate: 70,
      };

      const target = getTarget(agency.name);
      const sales = metrics.totalSales;

      let targetMeta = 'STABLE';
      if (sales >= target) {
        targetMeta = 'ON TRACK';
      } else if (sales < target * 0.7) {
        targetMeta = 'RISK';
      }

      return {
        agencyId: agency.agencyId,
        name: agency.name,
        address: agency.address || agency.largeAddress,
        ticketsSold: metrics.ticketsSold,
        conversionRate: metrics.conversionRate,
        revenue: sales,
        target,
        targetMeta,
        lat: agency.lat ? parseFloat(agency.lat) : -8.11599,
        lng: agency.lng ? parseFloat(agency.lng) : -79.02998,
      };
    });

    const cities = ['Piura', 'Trujillo', 'Chiclayo', 'Chimbote', 'Lima', 'Sullana'];
    const chartData = cities.map((city) => {
      const cityAgencies = mappedAgencies.filter((a) => a.name.toUpperCase().includes(city.toUpperCase()));
      const actual = cityAgencies.reduce((sum, a) => sum + a.revenue, 0);
      const target = cityAgencies.reduce((sum, a) => sum + a.target, 0) || getTarget(city);
      return {
        name: city,
        actual,
        target,
      };
    });

    return {
      agencies: mappedAgencies,
      chartData,
    };
  }

  async getRoutesReport() {
    interface RawRouteMetric {
      fromDestinationId: number;
      toDestinationId: number;
      ticketsSold: number;
      revenue: number;
      loadFactor: number;
    }

    interface RawRoutesReport {
      routeMetrics: RawRouteMetric[];
    }

    const rawData = await firstValueFrom<RawRoutesReport>(
      this.paymentClient.send('getRoutesReport', {}),
    );

    if (!rawData) {
      return null;
    }

    const destinations = await this.destinationRepository.find();
    const destMap = new Map(destinations.map((d) => [d.destinationId, d]));

    const mappedRoutes = rawData.routeMetrics.map((r) => {
      const fromDest = destMap.get(r.fromDestinationId);
      const toDest = destMap.get(r.toDestinationId);

      const originName = fromDest?.name || `Destino #${r.fromDestinationId}`;
      const destName = toDest?.name || `Destino #${r.toDestinationId}`;

      const originLat = fromDest?.lat ? parseFloat(fromDest.lat) : -8.11599;
      const originLng = fromDest?.lng ? parseFloat(fromDest.lng) : -79.02998;
      const destLat = toDest?.lat ? parseFloat(toDest.lat) : -12.04637;
      const destLng = toDest?.lng ? parseFloat(toDest.lng) : -77.04279;

      let trend = 'STABLE';
      if (r.loadFactor >= 75) {
        trend = 'UP';
      } else if (r.loadFactor < 60) {
        trend = 'DOWN';
      }

      return {
        routeId: `${r.fromDestinationId}-${r.toDestinationId}`,
        originName,
        destName,
        originLat,
        originLng,
        destLat,
        destLng,
        passengerVolume: r.ticketsSold,
        grossProfit: r.revenue,
        loadFactor: r.loadFactor,
        trend,
      };
    });

    mappedRoutes.sort((a, b) => b.grossProfit - a.grossProfit);

    const totalRouteRevenue = mappedRoutes.reduce((sum, r) => sum + r.grossProfit, 0);
    const avgPassengerLoad = mappedRoutes.length > 0
      ? Math.round((mappedRoutes.reduce((sum, r) => sum + r.loadFactor, 0) / mappedRoutes.length) * 10) / 10
      : 0;

    return {
      totalRouteRevenue,
      avgPassengerLoad,
      routes: mappedRoutes,
    };
  }
}
