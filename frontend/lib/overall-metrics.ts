// Static metric definitions used to render the public dashboard summary cards.
import { Users, Calendar, UserCheck, DollarSign } from "lucide-react";

export const overallMetrics = [
  {
    icon: Users,
    label: "Pessoas Atendidas",
    value: "+7800",
    color: "text-blue-600",
  },
  {
    icon: UserCheck,
    label: "Participantes",
    value: "+1600",
    color: "text-purple-600",
  },
  {
    icon: Calendar,
    label: "Alimentos",
    value: "28190kg",
    color: "text-green-600",
  },
  {
    icon: DollarSign,
    label: "Cestas Básicas",
    value: "5851",
    color: "text-orange-600",
  },
];
