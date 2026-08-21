// Static metric definitions used to render the public dashboard summary cards.
// The former `color` field (blue/purple/green/orange) was never read and was
// off-palette anyway — these render on the forest surface.
import { Users, Calendar, UserCheck, DollarSign } from "lucide-react";

export const overallMetrics = [
  { icon: Users, label: "Pessoas atendidas", value: "+7.800" },
  { icon: UserCheck, label: "Participantes", value: "+1.600" },
  { icon: Calendar, label: "Alimentos", value: "28.190 kg" },
  { icon: DollarSign, label: "Cestas básicas", value: "5.851" },
];
