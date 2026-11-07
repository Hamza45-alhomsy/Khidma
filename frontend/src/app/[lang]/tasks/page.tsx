import { Suspense } from "react";
import { Services } from "../../../components/services/services";
import { getAllTasksAction } from "@/actions/tasksActions";
export default async function ServicesPage() {
  const services = await getAllTasksAction();
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Services services={services} />
      </Suspense>
    </div>
  );
}
