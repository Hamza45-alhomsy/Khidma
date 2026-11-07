import { Suspense } from "react";
import { Services } from "../../../components/services/services";
import { getAllServicesAction } from "@/actions/servicesActions";
export default async function ServicesPage() {
  const services = await getAllServicesAction();
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Services services={services} />
      </Suspense>
    </div>
  );
}
