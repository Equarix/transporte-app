import {
  Button,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@heroui/react";
import {
  LuStar,
  LuTrash2,
  LuSmile,
  LuClock,
  LuUser,
  LuNavigation,
} from "react-icons/lu";
import Container from "@/components/ui/container/Container";
import Header from "@/components/layouts/header/Header";
import {
  useReviews,
  useReviewMetrics,
  useDeleteReview,
} from "../hooks/useReviews";
import type { Review } from "../services/resenas.service";

function KpiCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm p-5">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const { reviews, isLoading: isLoadReviews } = useReviews();
  const { metrics, isLoading: isLoadMetrics } = useReviewMetrics();
  const { deleteReview } = useDeleteReview();

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar esta reseña?")) {
      deleteReview(id);
    }
  };

  if (isLoadReviews || isLoadMetrics) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner size="lg" label="Cargando reseñas..." color="warning" />
      </div>
    );
  }

  const reviewMetrics = metrics ?? {
    totalReviews: 0,
    avgComfort: 0,
    avgPunctuality: 0,
    avgService: 0,
    avgDriver: 0,
    avgOverall: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  return (
    <Container className="space-y-6">
      {/* Header */}
      <Header
        text={{ header: "Calificaciones de Clientes", button: "" }}
        onClick={() => {}}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          label="Promedio General"
          value={`${reviewMetrics.avgOverall} / 5`}
          icon={<LuStar size={22} className="text-amber-500 fill-amber-500" />}
          color="bg-amber-100 dark:bg-amber-500/15"
        />
        <KpiCard
          label="Total de Reseñas"
          value={reviewMetrics.totalReviews}
          icon={<LuUser size={22} className="text-violet-500" />}
          color="bg-violet-100 dark:bg-violet-500/15"
        />
        <KpiCard
          label="Comodidad Bus"
          value={`${reviewMetrics.avgComfort} / 5`}
          icon={<LuSmile size={22} className="text-sky-500" />}
          color="bg-sky-100 dark:bg-sky-500/15"
        />
        <KpiCard
          label="Puntualidad"
          value={`${reviewMetrics.avgPunctuality} / 5`}
          icon={<LuClock size={22} className="text-emerald-500" />}
          color="bg-emerald-100 dark:bg-emerald-500/15"
        />
        <KpiCard
          label="Servicio"
          value={`${reviewMetrics.avgService} / 5`}
          icon={<LuSmile size={22} className="text-pink-500" />}
          color="bg-pink-100 dark:bg-pink-500/15"
        />
        <KpiCard
          label="Conductor"
          value={`${reviewMetrics.avgDriver} / 5`}
          icon={<LuNavigation size={22} className="text-teal-500" />}
          color="bg-teal-100 dark:bg-teal-500/15"
        />
      </div>

      {/* Distribution Graph (Sleek custom implementation) */}
      {reviewMetrics.totalReviews > 0 && (
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Distribución de Calificaciones (Estrellas)
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviewMetrics.ratingDistribution[star] || 0;
              const percentage =
                reviewMetrics.totalReviews > 0
                  ? (count / reviewMetrics.totalReviews) * 100
                  : 0;
              return (
                <div key={star} className="flex items-center gap-4">
                  <div className="w-16 flex items-center gap-1 font-bold text-sm text-zinc-600 dark:text-zinc-400">
                    <span>{star}</span>
                    <LuStar
                      size={14}
                      className="text-amber-500 fill-amber-500"
                    />
                  </div>
                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-right font-bold text-xs text-zinc-500 dark:text-zinc-500">
                    {count} ({Math.round(percentage)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CRUD Table */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
        <Table aria-label="Tabla de Reseñas" shadow="none">
          <TableHeader>
            <TableColumn>CLIENTE (ID)</TableColumn>
            <TableColumn>RESERVA (ID)</TableColumn>
            <TableColumn>CALIFICACIONES (CO / PU / SE / DI)</TableColumn>
            <TableColumn>PROMEDIO</TableColumn>
            <TableColumn className="w-80">COMENTARIO</TableColumn>
            <TableColumn>FECHA</TableColumn>
            <TableColumn className="text-center">ACCIONES</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay reseñas disponibles.">
            {reviews.map((review: Review) => {
              const overall = (
                (review.comfortScore +
                  review.punctualityScore +
                  review.serviceScore +
                  review.driverScore) /
                4
              ).toFixed(1);

              return (
                <TableRow key={review.resenaId}>
                  <TableCell>
                    <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                      ID: {review.userId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-sm text-zinc-700 dark:text-zinc-300">
                      IT-{review.saleId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      <span className="text-sky-600" title="Comodidad">
                        {review.comfortScore}★
                      </span>{" "}
                      /{" "}
                      <span className="text-emerald-600" title="Puntualidad">
                        {review.punctualityScore}★
                      </span>{" "}
                      /{" "}
                      <span className="text-pink-600" title="Servicio">
                        {review.serviceScore}★
                      </span>{" "}
                      /{" "}
                      <span className="text-teal-600" title="Conductor">
                        {review.driverScore}★
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-bold text-amber-600 text-sm">
                      {overall}{" "}
                      <LuStar className="size-4 fill-amber-500 text-amber-500" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p
                      className="text-xs font-medium text-zinc-600 dark:text-zinc-400 italic break-words line-clamp-2 max-w-xs"
                      title={review.comment || ""}
                    >
                      {review.comment || "Sin comentarios adicionales"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold text-zinc-500">
                      {new Date(review.createdAt).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip content="Eliminar Reseña" color="danger">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(review.resenaId)}
                      >
                        <LuTrash2 size={16} />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
