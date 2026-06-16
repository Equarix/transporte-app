import os
import sys
import argparse
import random
import re
from datetime import datetime, timedelta
from faker import Faker
import pymssql

# Set up Faker with Spanish locale for realistic data
fake = Faker('es_ES')

# Peruvian destinations & details for Entrafesa (Northern Peru routes)
PERUVIAN_DESTINATIONS = [
    {
        "name": "Lima",
        "slug": "lima",
        "short": "Capital del Perú, centro de conexiones y negocios.",
        "long": "Lima es la capital de la República del Perú. Se encuentra situada en la costa central del país, a orillas del océano Pacífico, conformando una extensa y populosa área urbana conocida como Lima Metropolitana.",
        "lat": "-12.046374", "lng": "-77.042793",
        "experiences": [
            {"type": "food", "name": "Cevichería Mi Barrunto", "desc": "El mejor ceviche tradicional con pescados frescos del día en el distrito de La Victoria."},
            {"type": "location", "name": "Centro Histórico de Lima", "desc": "Visita guiada por la Plaza Mayor, la Catedral de Lima y las catacumbas de San Francisco."},
            {"type": "activity", "name": "Parapente en Miraflores", "desc": "Vuela sobre el acantilado de la Costa Verde con instructores calificados."}
        ]
    },
    {
        "name": "Trujillo",
        "slug": "trujillo",
        "short": "Ciudad de la Eterna Primavera e historia moche.",
        "long": "Trujillo es una ciudad peruana, capital del departamento de La Libertad. Es la tercera ciudad más poblada del Perú y destaca por sus monumentos arqueológicos y su clima primaveral constante.",
        "lat": "-8.11599", "lng": "-79.02998",
        "experiences": [
            {"type": "location", "name": "Ciudadela de Chan Chan", "desc": "La ciudad de barro más grande de América Latina precolombina."},
            {"type": "food", "name": "Shámbar Trujillano", "desc": "Sopa tradicional de los lunes a base de menestras, trigo, piel de cerdo y jamón ahumado."},
            {"type": "activity", "name": "Caballitos de Totora en Huanchaco", "desc": "Paseo en las milenarias embarcaciones artesanales usadas por los moches."}
        ]
    },
    {
        "name": "Chiclayo",
        "slug": "chiclayo",
        "short": "Ciudad de la Amistad y rica gastronomía lambayecana.",
        "long": "Chiclayo es la capital del departamento de Lambayeque. Conocida por su hospitalidad, mercados esotéricos y los increíbles descubrimientos arqueológicos del Señor de Sipán.",
        "lat": "-6.77137", "lng": "-79.84088",
        "experiences": [
            {"type": "location", "name": "Museo Tumbas Reales de Sipán", "desc": "Uno de los museos arqueológicos más importantes del continente, albergando el ajuar del Señor de Sipán."},
            {"type": "food", "name": "Arroz con Pato a la Chiclayana", "desc": "Plato bandera de Lambayeque preparado con culantro, cerveza negra y pato tierno."},
            {"type": "activity", "name": "Visita al Mercado de Brujos", "desc": "Recorrido para conocer las plantas medicinales y rituales místicos tradicionales."}
        ]
    },
    {
        "name": "Cajamarca",
        "slug": "cajamarca",
        "short": "Cuna del encuentro de dos mundos y exquisitos quesos.",
        "long": "Cajamarca destaca por su arquitectura colonial en piedra, sus aguas termales de los Baños del Inca y el histórico Cuarto del Rescate donde estuvo prisionero el Inca Atahualpa.",
        "lat": "-7.16378", "lng": "-78.50027",
        "experiences": [
            {"type": "location", "name": "Baños del Inca", "desc": "Pozas de aguas termales medicinales con propiedades curativas de origen volcánico."},
            {"type": "food", "name": "Caldo Verde y Humitas", "desc": "Sopa tradicional con hierbas andinas, acompañada de humitas de choclo fresco."},
            {"type": "activity", "name": "Las Ventanillas de Otuzco", "desc": "Exploración de la necrópolis pre-inca tallada en farallones de roca volcánica."}
        ]
    },
    {
        "name": "Piura",
        "slug": "piura",
        "short": "Ciudad del eterno calor, sol y hermosas playas.",
        "long": "Piura destaca por su clima cálido, su folclore, sus cerámicas de Chulucanas y las espectaculares playas del norte peruano como Máncora, Colán y Cabo Blanco.",
        "lat": "-5.19449", "lng": "-80.63282",
        "experiences": [
            {"type": "location", "name": "Playa Máncora", "desc": "Principal destino de surf, relax y avistamiento de ballenas jorobadas."},
            {"type": "food", "name": "Seco de Chabelo", "desc": "Plato piurano a base de plátano verde machacado, cecina y chicha de jora."},
            {"type": "activity", "name": "Taller de Cerámica en Chulucanas", "desc": "Aprende las técnicas ancestrales de decoración y quemado de vasijas de arcilla."}
        ]
    },
    {
        "name": "Pacasmayo",
        "slug": "pacasmayo",
        "short": "Puerto histórico y paraíso del windsurf.",
        "long": "Pacasmayo es un distrito costero ubicado en La Libertad, famoso por su muelle centenario, sus olas perfectas para deportes acuáticos y su arquitectura republicana.",
        "lat": "-7.40056", "lng": "-79.57139",
        "experiences": [
            {"type": "activity", "name": "Windsurf en El Faro", "desc": "Navega en uno de los puntos con viento constante más valorados del continente."},
            {"type": "food", "name": "Ceviche de Calamar y Conchas Negras", "desc": "Disfruta de mariscos frescos extraídos directamente del litoral pacasmayino."}
        ]
    },
    {
        "name": "Chimbote",
        "slug": "chimbote",
        "short": "Importante puerto pesquero del norte central.",
        "long": "Chimbote destaca por su gran actividad pesquera e industrial. Posee una bahía hermosa y es la puerta de entrada al Callejón de Huaylas desde la costa ancashina.",
        "lat": "-9.08528", "lng": "-78.57833",
        "experiences": [
            {"type": "location", "name": "Isla Blanca", "desc": "Paseo costero en lancha a la hermosa reserva natural habitada por lobos marinos y aves guaneras."}
        ]
    }
]

BUS_MODELS = [
    {"model": "Marcopolo Paradiso 1800 DD", "capacity": 60, "type": "Doble Piso Premium"},
    {"model": "Marcopolo Paradiso 1200", "capacity": 44, "type": "Piso Simple Ejecutivo"},
    {"model": "Irizar i8", "capacity": 52, "type": "Doble Piso Suite"},
    {"model": "Scania K410", "capacity": 48, "type": "Semicama Confort"},
    {"model": "Volvo B450R", "capacity": 56, "type": "Bus Cama Ejecutivo"}
]

AGENCY_SERVICES_POOL = [
    {"name": "Wi-Fi Gratis", "icon": "wifi"},
    {"name": "Aire Acondicionado", "icon": "ac_unit"},
    {"name": "Custodia de Equipaje", "icon": "luggage"},
    {"name": "Servicio de Encomiendas", "icon": "local_shipping"},
    {"name": "Venta de Pasajes", "icon": "confirmation_number"},
    {"name": "Sala de Espera VIP", "icon": "chair"},
    {"name": "Cafetería", "icon": "local_cafe"}
]

def load_db_config(project_dir):
    """Reads a NestJS project .env file to extract database credentials."""
    config = {}
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', project_dir, '.env'))
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    match = re.match(r'^([^=]+)=(.*)$', line)
                    if match:
                        key = match.group(1).strip()
                        val = match.group(2).strip()
                        if val.startswith('"') and val.endswith('"'):
                            val = val[1:-1]
                        if val.startswith("'") and val.endswith("'"):
                            val = val[1:-1]
                        config[key] = val
    return config

def generate_mock_data(scale=1.0):
    """Generates lists of dicts containing mock data for both databases in memory."""
    # Scale variables
    n_galery = int(max(30, 30 * scale))
    n_clients = int(max(50, 100 * scale))
    n_employees = int(max(10, 20 * scale))
    n_drivers = int(max(10, 15 * scale))
    n_buses = int(max(6, 12 * scale))
    n_agencies = len(PERUVIAN_DESTINATIONS)
    n_reservations = int(max(100, 300 * scale))
    
    print(f"\n--- Generando Mock Data Relacionada (Escala: {scale}) ---")
    print(f"- Galería Imágenes: {n_galery}")
    print(f"- Perfiles de Cliente: {n_clients}")
    print(f"- Perfiles de Empleado (Admin/Vendedores): {n_employees}")
    print(f"- Perfiles de Conductor: {n_drivers}")
    print(f"- Buses: {n_buses}")
    print(f"- Agencias: {n_agencies}")
    print(f"- Reservaciones / Ventas: {n_reservations}")
    
    # 1. GALERY
    galery_list = []
    for i in range(1, n_galery + 1):
        galery_list.append({
            "imageId": i,
            "imageUrl": f"https://picsum.photos/seed/entrafesa_{i}/800/600",
            "imageName": f"foto_viaje_entrafesa_{i}.jpg",
            "createdAt": (datetime.now() - timedelta(days=random.randint(10, 100))).strftime('%Y-%m-%d %H:%M:%S')
        })
        
    # 2. PROFILES
    profile_list = []
    profile_id_counter = 1
    
    # Clients
    for _ in range(n_clients):
        profile_list.append({
            "userId": profile_id_counter,
            "typeDocument": random.choice(["DNI", "CE"]),
            "documentNumber": "".join([str(random.randint(0, 9)) for _ in range(8)]),
            "firstName": fake.first_name(),
            "lastName": f"{fake.last_name()} {fake.last_name()}",
            "email": fake.email(),
            "phone": "9" + "".join([str(random.randint(0, 9)) for _ in range(8)]),
            "dateOfBirth": fake.date_of_birth(minimum_age=18, maximum_age=75).strftime('%Y-%m-%d'),
            "typeUser": "CLIENT",
            "isActive": 1
        })
        profile_id_counter += 1
        
    # Employees
    for _ in range(n_employees):
        profile_list.append({
            "userId": profile_id_counter,
            "typeDocument": "DNI",
            "documentNumber": "".join([str(random.randint(0, 9)) for _ in range(8)]),
            "firstName": fake.first_name(),
            "lastName": f"{fake.last_name()} {fake.last_name()}",
            "email": fake.email(),
            "phone": "9" + "".join([str(random.randint(0, 9)) for _ in range(8)]),
            "dateOfBirth": fake.date_of_birth(minimum_age=20, maximum_age=60).strftime('%Y-%m-%d'),
            "typeUser": "EMPLOYEE",
            "isActive": 1
        })
        profile_id_counter += 1
        
    # Drivers
    driver_ids = []
    for _ in range(n_drivers):
        profile_list.append({
            "userId": profile_id_counter,
            "typeDocument": "DNI",
            "documentNumber": "".join([str(random.randint(0, 9)) for _ in range(8)]),
            "firstName": fake.first_name(),
            "lastName": f"{fake.last_name()} {fake.last_name()}",
            "email": fake.email(),
            "phone": "9" + "".join([str(random.randint(0, 9)) for _ in range(8)]),
            "dateOfBirth": fake.date_of_birth(minimum_age=25, maximum_age=65).strftime('%Y-%m-%d'),
            "typeUser": "DRIVER",
            "isActive": 1
        })
        driver_ids.append(profile_id_counter)
        profile_id_counter += 1
        
    # 3. USERS
    user_list = []
    user_id_counter = 1
    mock_password_hash = "$2b$10$EPf91mB12nF8Wb2P.qfFdugD0o4G.Hq5BvVbZ/Q2b4K8P1XWb1mO2" # matches 'password123'
    
    for p in profile_list:
        if p["typeUser"] in ["CLIENT", "EMPLOYEE"]:
            role = "admin" if p["typeUser"] == "EMPLOYEE" and random.random() < 0.2 else (
                "seller" if p["typeUser"] == "EMPLOYEE" else "user"
            )
            user_list.append({
                "userId": user_id_counter,
                "password": mock_password_hash,
                "typeDocument": p["typeDocument"],
                "documentNumber": p["documentNumber"],
                "role": role,
                "profileUserId": p["userId"]
            })
            user_id_counter += 1

    # 4. DESTINATION
    destination_list = []
    experience_list = []
    dest_id_counter = 1
    exp_id_counter = 1
    
    for p_dest in PERUVIAN_DESTINATIONS:
        galery_img = random.choice(galery_list)["imageId"]
        destination_list.append({
            "destinationId": dest_id_counter,
            "name": p_dest["name"],
            "slug": p_dest["slug"],
            "shortDescription": p_dest["short"],
            "longDescription": p_dest["long"],
            "lat": p_dest["lat"],
            "lng": p_dest["lng"],
            "status": 1,
            "galeryImageId": galery_img
        })
        
        if "experiences" in p_dest:
            for exp in p_dest["experiences"]:
                experience_list.append({
                    "experienceId": exp_id_counter,
                    "type": exp["type"],
                    "name": exp["name"],
                    "description": exp["desc"],
                    "lat": str(float(p_dest["lat"]) + random.uniform(-0.02, 0.02)),
                    "lng": str(float(p_dest["lng"]) + random.uniform(-0.02, 0.02)),
                    "destinationDestinationId": dest_id_counter,
                    "galeryImageId": random.choice(galery_list)["imageId"]
                })
                exp_id_counter += 1
        dest_id_counter += 1
        
    # 5. BUS, FLOOR, SEATS
    bus_list = []
    floor_list = []
    seat_list = []
    
    bus_id_counter = 1
    floor_id_counter = 1
    seat_id_counter = 1
    
    for _ in range(n_buses):
        model_info = random.choice(BUS_MODELS)
        letters = "".join(random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ") for _ in range(3))
        numbers = "".join(random.choice("0123456789") for _ in range(3))
        plate = f"{letters}-{numbers}"
        
        bus_list.append({
            "busId": bus_id_counter,
            "plate": plate,
            "model": model_info["model"],
            "year": random.randint(2018, 2026),
            "capacity": model_info["capacity"],
            "status": 1,
            "type": model_info["type"],
            "name": f"Hércules {random.randint(100, 999)}"
        })
        
        n_floors = 2 if "Doble" in model_info["type"] else 1
        floors_for_this_bus = []
        
        for f_idx in range(1, n_floors + 1):
            floor_cols = 4
            floor_rows = (model_info["capacity"] // n_floors) // floor_cols
            if floor_rows < 3: floor_rows = 5
            
            floor_item = {
                "floorId": floor_id_counter,
                "name": f"Piso {f_idx}",
                "order": f_idx,
                "columns": floor_cols,
                "rows": floor_rows,
                "status": 1,
                "busBusId": bus_id_counter
            }
            floor_list.append(floor_item)
            floors_for_this_bus.append(floor_item)
            
            seat_num = 1
            for r_val in range(1, floor_rows + 1):
                for c_val in range(1, floor_cols + 1):
                    type_seat = "asiento"
                    seat_name = f"{(f_idx-1)*30 + seat_num}"
                    
                    if r_val == floor_rows and c_val == floor_cols and n_floors == 2:
                        type_seat = "escalera"
                        seat_name = "ESC"
                    elif r_val == 1 and c_val == 1 and f_idx == 1:
                        type_seat = "limpieza"
                        seat_name = "SSHH"
                        
                    seat_list.append({
                        "seatId": seat_id_counter,
                        "name": seat_name,
                        "typeSeat": type_seat,
                        "status": 1,
                        "row": r_val,
                        "column": c_val,
                        "floorFloorId": floor_id_counter
                    })
                    seat_id_counter += 1
                    seat_num += 1
                    
            floor_id_counter += 1
        bus_id_counter += 1

    # 6. AGENCY & SERVICES
    agency_list = []
    agency_services = []
    user_agency_list = []
    
    agency_id_counter = 1
    agency_srv_id_counter = 1
    user_ag_id_counter = 1
    
    for dest in destination_list:
        agency_list.append({
            "agencyId": agency_id_counter,
            "name": f"Terminal Entrafesa {dest['name']}",
            "largeAddress": f"Av. Principal {random.randint(100, 2500)}, {dest['name']}, Perú",
            "address": f"Av. Principal {random.randint(100, 2500)}",
            "phone": "044-" + "".join([str(random.randint(0, 9)) for _ in range(6)]),
            "description": f"Terminal principal de pasajeros y recepción de encomiendas de Entrafesa en la ciudad de {dest['name']}.",
            "status": 1,
            "lat": dest["lat"],
            "lng": dest["lng"],
            "galeryImageId": random.choice(galery_list)["imageId"],
            "slug": f"terminal-{dest['slug']}"
        })
        
        sampled_services = random.sample(AGENCY_SERVICES_POOL, random.randint(3, 5))
        for srv in sampled_services:
            agency_services.append({
                "agencyServiceId": agency_srv_id_counter,
                "icon": srv["icon"],
                "name": srv["name"],
                "agencyAgencyId": agency_id_counter
            })
            agency_srv_id_counter += 1
            
        employees = [u for u in user_list if u["role"] in ["admin", "seller"]]
        if employees:
            assigned_employee = random.choice(employees)
            user_agency_list.append({
                "userAgencyId": user_ag_id_counter,
                "createdAt": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "status": 1,
                "userUserId": assigned_employee["userId"],
                "agencyAgencyId": agency_id_counter
            })
            user_ag_id_counter += 1
        agency_id_counter += 1

    # 7. RESERVER (Main DB)
    reserver_list = []
    reserver_agency_list = []
    reserver_price_floor_list = []
    
    # 8. SALES DATABASE (transporte_sales)
    sale_payer_list = []
    sale_list = []
    sale_detail_list = []
    points_user_list = []
    hotel_detail_list = []
    
    reserver_id_counter = 1
    reserver_ag_id_counter = 1
    reserver_pf_id_counter = 1
    
    sale_payer_id_counter = 1
    sale_id_counter = 1
    sale_detail_id_counter = 1
    points_user_id_counter = 1
    hotel_id_counter = 1
    
    regular_users = [u for u in user_list if u["role"] == "user"]
    if not regular_users:
        regular_users = user_list
        
    for _ in range(n_reservations):
        # Origins/Destinations
        dest_in = random.choice(destination_list)
        dest_out = random.choice([d for d in destination_list if d["destinationId"] != dest_in["destinationId"]])
        
        selected_bus = random.choice(bus_list)
        floors_in_bus = [f for f in floor_list if f["busBusId"] == selected_bus["busId"]]
        seats_in_bus = [s for s in seat_list if s["floorFloorId"] in [f["floorId"] for f in floors_in_bus] and s["typeSeat"] == "asiento"]
        
        driver = random.choice(driver_ids)
        res_user = random.choice(regular_users)
        
        status = random.choice(["CONFIRMED", "COMPLETED", "PENDING", "CANCELLED"])
        res_date = (datetime.now() + timedelta(days=random.randint(-30, 30))).replace(hour=random.randint(6, 22), minute=random.choice([0, 15, 30, 45]), second=0)
        register_date = res_date - timedelta(days=random.randint(1, 7))
        
        # Insert reserver
        reserver_list.append({
            "reserverId": reserver_id_counter,
            "date": res_date.strftime('%Y-%m-%d %H:%M:%S'),
            "registerAt": register_date.strftime('%Y-%m-%d %H:%M:%S'),
            "status": status,
            "registerUserUserId": res_user["userId"],
            "checkInDestinationId": dest_in["destinationId"],
            "checkOutDestinationId": dest_out["destinationId"],
            "busBusId": selected_bus["busId"],
            "driverUserId": driver,
            "checkOutHour": (res_date + timedelta(hours=random.randint(4, 9))).strftime('%H:%M:%S')
        })
        
        # Floor pricing
        for fl in floors_in_bus:
            price_val = 50 if fl["order"] == 1 else 40
            reserver_price_floor_list.append({
                "reserverPriceFloorId": reserver_pf_id_counter,
                "price": price_val,
                "reserverReserverId": reserver_id_counter,
                "floorFloorId": fl["floorId"]
            })
            reserver_pf_id_counter += 1
            
        origin_agency = random.choice([a for a in agency_list if a["name"].endswith(dest_in["name"])])
        reserver_agency_list.append({
            "reserverAgencyId": reserver_ag_id_counter,
            "name": f"Abordaje {dest_in['name']}",
            "address": origin_agency["address"],
            "phone": origin_agency["phone"],
            "email": "contacto@entrafesa.pe",
            "hour": res_date.strftime('%H:%M'),
            "reserverReserverId": reserver_id_counter,
            "agencyAgencyId": origin_agency["agencyId"]
        })
        reserver_ag_id_counter += 1
        
        # --- SALES DB RELATION ---
        # 1. Create SalePayer
        payer_profile = next((p for p in profile_list if p["userId"] == res_user["profileUserId"]), None)
        sale_payer_list.append({
            "salePayerId": sale_payer_id_counter,
            "userId": res_user["userId"],
            "documentType": payer_profile["typeDocument"] if payer_profile else "DNI",
            "documentNumber": payer_profile["documentNumber"] if payer_profile else "".join([str(random.randint(0, 9)) for _ in range(8)]),
            "names": f"{payer_profile['firstName']} {payer_profile['lastName']}" if payer_profile else fake.name(),
            "email": payer_profile["email"] if payer_profile else fake.email(),
            "phone": payer_profile["phone"] if payer_profile else "9" + "".join([str(random.randint(0, 9)) for _ in range(8)]),
            "providerMethod": random.choice(["VISA", "MASTERCARD", "YAPE", "PLIN", "EFECTIVO"]),
            "typeMethod": random.choice(["CARD", "WALLET", "CASH"])
        })
        
        # 2. Create Sale
        sale_status = "APROBADO" if status == "CONFIRMED" or status == "COMPLETED" else (
            "CANCELADO" if status == "CANCELLED" else "PENDIENTE"
        )
        sale_list.append({
            "saleId": sale_id_counter,
            "createdAt": register_date.strftime('%Y-%m-%d %H:%M:%S'),
            "userId": res_user["userId"],
            "status": sale_status,
            "purchaseFrom": random.choice(["WEB", "TAQUILLA"]),
            "fromDestinationId": dest_in["destinationId"],
            "toDestinationId": dest_out["destinationId"],
            "agencyId": origin_agency["agencyId"],
            "reserverId": reserver_id_counter,
            "salePayerSalePayerId": sale_payer_id_counter
        })
        
        # 3. Create SaleDetail (Passengers and booked seats)
        # Randomly choose between 1 to 3 tickets per reservation/sale
        tickets_count = random.randint(1, 3)
        booked_seats = random.sample(seats_in_bus, min(tickets_count, len(seats_in_bus)))
        
        total_amount = 0
        for seat in booked_seats:
            seat_floor = next((f for f in floors_in_bus if f["floorId"] == seat["floorFloorId"]), None)
            seat_price = 50 if (seat_floor and seat_floor["order"] == 1) else 40
            total_amount += seat_price
            
            sale_detail_list.append({
                "saleDetailId": sale_detail_id_counter,
                "busId": selected_bus["busId"],
                "seatId": seat["seatId"],
                "documentType": "DNI",
                "documentNumber": "".join([str(random.randint(0, 9)) for _ in range(8)]),
                "name": fake.name(),
                "amount": seat_price,
                "row": seat["row"],
                "column": seat["column"],
                "floor": seat_floor["order"] if seat_floor else 1,
                "typeSeat": seat["typeSeat"],
                "saleSaleId": sale_id_counter
            })
            sale_detail_id_counter += 1
            
        # 4. Points User
        if sale_status == "APROBADO":
            points_earned = int(total_amount / 10) # 1 point per 10 soles
            points_user_list.append({
                "pointsUserId": points_user_id_counter,
                "userId": res_user["userId"],
                "points": points_earned,
                "createdAt": register_date.strftime('%Y-%m-%d %H:%M:%S'),
                "pointsFrom": "SALE",
                "type": "ADDITION",
                "saleSaleId": sale_id_counter
            })
            points_user_id_counter += 1
            
        # 5. Optional Hotel booking detail associated with the travel sale (15% chance)
        if random.random() < 0.15 and sale_status == "APROBADO":
            hotel_detail_list.append({
                "hotelDetailId": hotel_id_counter,
                "hotelId": random.randint(1, 20),
                "referenceNumber": f"HTL-{random.randint(100000, 999999)}",
                "clientName": f"{payer_profile['firstName']} {payer_profile['lastName']}" if payer_profile else fake.name(),
                "roomId": random.randint(101, 505),
                "hotelName": f"Hotel {dest_out['name']} Inn",
                "checkIn": res_date.strftime('%Y-%m-%d %H:%M:%S'),
                "checkOut": (res_date + timedelta(days=random.randint(1, 4))).strftime('%Y-%m-%d %H:%M:%S'),
                "amount": random.randint(120, 450),
                "saleSaleId": sale_id_counter
            })
            hotel_id_counter += 1
            
        sale_payer_id_counter += 1
        sale_id_counter += 1
        reserver_id_counter += 1

    return {
        # main db
        "main": {
            "galery": galery_list,
            "profile": profile_list,
            "user": user_list,
            "destination": destination_list,
            "experience": experience_list,
            "bus": bus_list,
            "floor": floor_list,
            "seat": seat_list,
            "agency": agency_list,
            "agency_services": agency_services,
            "user_agency": user_agency_list,
            "reserver": reserver_list,
            "reserver_price_floor": reserver_price_floor_list,
            "reserver_agency": reserver_agency_list
        },
        # sales db
        "sales": {
            "sale_payer": sale_payer_list,
            "sale": sale_list,
            "sale_detail": sale_detail_list,
            "points_user": points_user_list,
            "hotel_detail": hotel_detail_list
        }
    }

def insert_main_db(data, db_config):
    """Inserts mock data directly to the main 'transporte' database."""
    if not db_config:
        print("Error: No se pudo leer la configuración de la base de datos principal desde api/.env")
        return False
        
    print(f"\nConectando a base de datos PRINCIPAL en {db_config.get('DB_HOST')}:{db_config.get('DB_PORT', '1433')} ({db_config.get('DB_NAME')})...")
    try:
        conn = pymssql.connect(
            server=db_config.get('DB_HOST'),
            port=db_config.get('DB_PORT', '1433'),
            user=db_config.get('DB_USER'),
            password=db_config.get('DB_PASSWORD'),
            database=db_config.get('DB_NAME'),
            autocommit=False
        )
        cursor = conn.cursor()
        
        # Disable constraints
        cursor.execute("EXEC sp_MSforeachtable \"ALTER TABLE ? NOCHECK CONSTRAINT all\";")
        
        # Clean existing data
        tables_in_order = [
            "reserver_price_floor", "reserver_agency", "reserver", "user_agency",
            "agency_services", "seat", "floor", "bus", "experience", "destination",
            "agency", "user", "profile", "galery"
        ]
        for tbl in tables_in_order:
            cursor.execute(f"DELETE FROM [{tbl}];")
            try:
                cursor.execute(f"DBCC CHECKIDENT ('[{tbl}]', RESEED, 0);")
            except Exception:
                pass

        # Helper to execute inserts with identity checks
        def insert_table(table_name, columns, rows):
            if not rows:
                return
            cursor.execute(f"SET IDENTITY_INSERT [{table_name}] ON;")
            col_list_str = ", ".join([f"[{c}]" for c in columns])
            placeholder_str = ", ".join(["%s" for _ in columns])
            insert_query = f"INSERT INTO [{table_name}] ({col_list_str}) VALUES ({placeholder_str})"
            
            chunk_size = 500
            for i in range(0, len(rows), chunk_size):
                chunk = rows[i:i + chunk_size]
                cursor.executemany(insert_query, chunk)
            cursor.execute(f"SET IDENTITY_INSERT [{table_name}] OFF;")

        # Insert tables
        insert_table("galery", ["imageId", "imageUrl", "imageName", "createdAt"], 
                     [(x['imageId'], x['imageUrl'], x['imageName'], x['createdAt']) for x in data["galery"]])
                     
        insert_table("profile", ["userId", "typeDocument", "documentNumber", "firstName", "lastName", "email", "phone", "dateOfBirth", "typeUser", "isActive"], 
                     [(x['userId'], x['typeDocument'], x['documentNumber'], x['firstName'], x['lastName'], x['email'], x['phone'], x['dateOfBirth'], x['typeUser'], x['isActive']) for x in data["profile"]])
                     
        insert_table("user", ["userId", "password", "typeDocument", "documentNumber", "role", "profileUserId"], 
                     [(x['userId'], x['password'], x['typeDocument'], x['documentNumber'], x['role'], x['profileUserId']) for x in data["user"]])
                     
        insert_table("agency", ["agencyId", "name", "largeAddress", "address", "phone", "description", "status", "lat", "lng", "galeryImageId", "slug"], 
                     [(x['agencyId'], x['name'], x['largeAddress'], x['address'], x['phone'], x['description'], x['status'], x['lat'], x['lng'], x['galeryImageId'], x['slug']) for x in data["agency"]])
                     
        insert_table("destination", ["destinationId", "name", "shortDescription", "longDescription", "lat", "lng", "status", "galeryImageId", "slug"], 
                     [(x['destinationId'], x['name'], x['shortDescription'], x['longDescription'], x['lat'], x['lng'], x['status'], x['galeryImageId'], x['slug']) for x in data["destination"]])
                     
        insert_table("experience", ["experienceId", "type", "name", "description", "lat", "lng", "destinationDestinationId", "galeryImageId"], 
                     [(x['experienceId'], x['type'], x['name'], x['description'], x['lat'], x['lng'], x['destinationDestinationId'], x['galeryImageId']) for x in data["experience"]])
                     
        insert_table("bus", ["busId", "plate", "model", "year", "capacity", "status", "type", "name"], 
                     [(x['busId'], x['plate'], x['model'], x['year'], x['capacity'], x['status'], x['type'], x['name']) for x in data["bus"]])
                     
        insert_table("floor", ["floorId", "name", "order", "columns", "rows", "status", "busBusId"], 
                     [(x['floorId'], x['name'], x['order'], x['columns'], x['rows'], x['status'], x['busBusId']) for x in data["floor"]])
                     
        insert_table("seat", ["seatId", "name", "typeSeat", "status", "row", "column", "floorFloorId"], 
                     [(x['seatId'], x['name'], x['typeSeat'], x['status'], x['row'], x['column'], x['floorFloorId']) for x in data["seat"]])
                     
        insert_table("agency_services", ["agencyServiceId", "icon", "name", "agencyAgencyId"], 
                     [(x['agencyServiceId'], x['icon'], x['name'], x['agencyAgencyId']) for x in data["agency_services"]])
                     
        insert_table("user_agency", ["userAgencyId", "createdAt", "status", "userUserId", "agencyAgencyId"], 
                     [(x['userAgencyId'], x['createdAt'], x['status'], x['userUserId'], x['agencyAgencyId']) for x in data["user_agency"]])
                     
        insert_table("reserver", ["reserverId", "date", "registerAt", "status", "registerUserUserId", "checkInDestinationId", "checkOutDestinationId", "busBusId", "driverUserId", "checkOutHour"], 
                     [(x['reserverId'], x['date'], x['registerAt'], x['status'], x['registerUserUserId'], x['checkInDestinationId'], x['checkOutDestinationId'], x['busBusId'], x['driverUserId'], x['checkOutHour']) for x in data["reserver"]])
                     
        insert_table("reserver_agency", ["reserverAgencyId", "name", "address", "phone", "email", "hour", "reserverReserverId", "agencyAgencyId"], 
                     [(x['reserverAgencyId'], x['name'], x['address'], x['phone'], x['email'], x['hour'], x['reserverReserverId'], x['agencyAgencyId']) for x in data["reserver_agency"]])
                     
        insert_table("reserver_price_floor", ["reserverPriceFloorId", "price", "reserverReserverId", "floorFloorId"], 
                     [(x['reserverPriceFloorId'], x['price'], x['reserverReserverId'], x['floorFloorId']) for x in data["reserver_price_floor"]])

        # Enable constraints
        cursor.execute("EXEC sp_MSforeachtable \"ALTER TABLE ? CHECK CONSTRAINT all\";")
        
        conn.commit()
        conn.close()
        print("¡Base de datos principal [transporte] cargada exitosamente!")
        return True
    except Exception as e:
        print(f"[ERROR] En Base de Datos Principal: {e}")
        try: conn.rollback()
        except: pass
        return False

def insert_sales_db(data, db_config):
    """Inserts mock data directly to the 'transporte_sales' database."""
    if not db_config:
        print("Error: No se pudo leer la configuración de la base de datos de ventas desde api-sales/.env")
        return False
        
    print(f"\nConectando a base de datos de VENTAS en {db_config.get('DB_HOST')}:{db_config.get('DB_PORT', '1433')} ({db_config.get('DB_NAME')})...")
    try:
        conn = pymssql.connect(
            server=db_config.get('DB_HOST'),
            port=db_config.get('DB_PORT', '1433'),
            user=db_config.get('DB_USER'),
            password=db_config.get('DB_PASSWORD'),
            database=db_config.get('DB_NAME'),
            autocommit=False
        )
        cursor = conn.cursor()
        
        # Disable constraints
        cursor.execute("EXEC sp_MSforeachtable \"ALTER TABLE ? NOCHECK CONSTRAINT all\";")
        
        # Clean existing data
        tables_in_order = ["hotel_detail", "points_user", "sale_detail", "sale", "sale_payer"]
        for tbl in tables_in_order:
            cursor.execute(f"DELETE FROM [{tbl}];")
            try:
                cursor.execute(f"DBCC CHECKIDENT ('[{tbl}]', RESEED, 0);")
            except Exception:
                pass

        # Helper to execute inserts with identity checks
        def insert_table(table_name, columns, rows):
            if not rows:
                return
            cursor.execute(f"SET IDENTITY_INSERT [{table_name}] ON;")
            col_list_str = ", ".join([f"[{c}]" for c in columns])
            placeholder_str = ", ".join(["%s" for _ in columns])
            insert_query = f"INSERT INTO [{table_name}] ({col_list_str}) VALUES ({placeholder_str})"
            
            chunk_size = 500
            for i in range(0, len(rows), chunk_size):
                chunk = rows[i:i + chunk_size]
                cursor.executemany(insert_query, chunk)
            cursor.execute(f"SET IDENTITY_INSERT [{table_name}] OFF;")

        # Insert tables
        insert_table("sale_payer", ["salePayerId", "userId", "documentType", "documentNumber", "names", "email", "phone", "providerMethod", "typeMethod"], 
                     [(x['salePayerId'], x['userId'], x['documentType'], x['documentNumber'], x['names'], x['email'], x['phone'], x['providerMethod'], x['typeMethod']) for x in data["sale_payer"]])
                     
        insert_table("sale", ["saleId", "createdAt", "userId", "status", "purchaseFrom", "fromDestinationId", "toDestinationId", "agencyId", "reserverId", "salePayerSalePayerId"], 
                     [(x['saleId'], x['createdAt'], x['userId'], x['status'], x['purchaseFrom'], x['fromDestinationId'], x['toDestinationId'], x['agencyId'], x['reserverId'], x['salePayerSalePayerId']) for x in data["sale"]])
                     
        insert_table("sale_detail", ["saleDetailId", "busId", "seatId", "documentType", "documentNumber", "name", "amount", "row", "column", "floor", "typeSeat", "saleSaleId"], 
                     [(x['saleDetailId'], x['busId'], x['seatId'], x['documentType'], x['documentNumber'], x['name'], x['amount'], x['row'], x['column'], x['floor'], x['typeSeat'], x['saleSaleId']) for x in data["sale_detail"]])
                     
        insert_table("points_user", ["pointsUserId", "userId", "points", "createdAt", "pointsFrom", "type", "saleSaleId"], 
                     [(x['pointsUserId'], x['userId'], x['points'], x['createdAt'], x['pointsFrom'], x['type'], x['saleSaleId']) for x in data["points_user"]])
                     
        insert_table("hotel_detail", ["hotelDetailId", "hotelId", "referenceNumber", "clientName", "roomId", "hotelName", "checkIn", "checkOut", "amount", "saleSaleId"], 
                     [(x['hotelDetailId'], x['hotelId'], x['referenceNumber'], x['clientName'], x['roomId'], x['hotelName'], x['checkIn'], x['checkOut'], x['amount'], x['saleSaleId']) for x in data["hotel_detail"]])

        # Enable constraints
        cursor.execute("EXEC sp_MSforeachtable \"ALTER TABLE ? CHECK CONSTRAINT all\";")
        
        conn.commit()
        conn.close()
        print("¡Base de datos de ventas [transporte_sales] cargada exitosamente!")
        return True
    except Exception as e:
        print(f"[ERROR] En Base de Datos de Ventas: {e}")
        try: conn.rollback()
        except: pass
        return False

def main():
    parser = argparse.ArgumentParser(description="Insertador de mock data masiva en español para Entrafesa y Transporte Sales (MSSQL)")
    parser.add_argument("--scale", type=float, default=1.0, help="Multiplicador para aumentar/disminuir la cantidad de datos (por defecto: 1.0)")
    args = parser.parse_args()
    
    if len(sys.argv) == 1:
        print("=== GENERADOR DE MOCK DATA DIRECTO A AMBAS BASES DE DATOS (Entrafesa & Sales) ===")
        try:
            scale_input = input("Introduce la escala de generación de datos (ejemplo: 0.5 para pocos, 1.0 estándar, 3.0 masivo) [1.0]: ").strip()
            args.scale = float(scale_input) if scale_input else 1.0
        except ValueError:
            print("Escala no válida, usando valor predeterminado 1.0")

    # Generate interrelated data
    mock_data = generate_mock_data(args.scale)
    
    # Load configs
    main_db_config = load_db_config("api")
    sales_db_config = load_db_config("api-sales")
    
    # Insert main database first (due to IDs mapping)
    success_main = insert_main_db(mock_data["main"], main_db_config)
    
    # Insert sales database next
    if success_main:
        success_sales = insert_sales_db(mock_data["sales"], sales_db_config)
        if success_sales:
            print("\n¡Todo el proceso se completó con éxito! Ambas bases de datos están sincronizadas y pobladas.")
        else:
            print("\nError al poblar la base de datos de ventas. La base de datos principal quedó poblada.")
    else:
        print("\nError al poblar la base de datos principal. Proceso abortado.")

if __name__ == "__main__":
    main()
