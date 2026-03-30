import TravelDetailClient from "./TravelDetailClient";

/** Placeholder para `output: 'export'`; el id real lo lee el cliente con useParams(). */
export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function TravelDetailPage() {
  return <TravelDetailClient />;
}
