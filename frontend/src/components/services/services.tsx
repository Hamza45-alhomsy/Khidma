import { ServicePayload } from "@/types/service";
import { useTranslations } from "next-intl";
interface ServicesProps {
  services: ServicePayload[];
}
export const Services = ({ services }: ServicesProps) => {
  const t = useTranslations("services");
  return (
    <div>
      <h1 className="text-3xl text-black font-bold mb-6">{t("title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service: ServicePayload) => (
          <div
            key={service.id}
            className="border bg-white rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-lg text-black font-bold"></h2>
            <p className="text-sm text-gray-600 mt-2">{service.description}</p>
            <div className="mt-4 font-bold text-blue-600">
              {service.budgetAmount} {service.budgetCurrency}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
