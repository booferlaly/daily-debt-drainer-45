
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { ChartContainer } from "./chart-container"
import { ChartTooltipContent, ChartLegendContent } from "./chart-tooltip"

// Pie Chart Component
export const PieChart: React.FC<{
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
}> = ({ 
  data, 
  index, 
  categories, 
  colors = ["#2563eb", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"], 
  valueFormatter = (value) => `${value}`,
  showLegend = true
}) => {
  const chartConfig: any = {};
  
  // Create config for data naming
  data.forEach((item, i) => {
    chartConfig[item[index]] = { color: colors[i % colors.length] };
  });

  return (
    <ChartContainer config={chartConfig}>
      <RechartsPrimitive.PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <RechartsPrimitive.Pie
          data={data}
          nameKey={index}
          dataKey={categories[0]}
          cx="50%"
          cy="50%"
          innerRadius="0%"
          outerRadius="80%"
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <RechartsPrimitive.Cell 
              key={`cell-${i}`} 
              fill={colors[i % colors.length]}
            />
          ))}
        </RechartsPrimitive.Pie>
        <RechartsPrimitive.Tooltip 
          content={({active, payload, label}) => 
            <ChartTooltipContent 
              active={active}
              payload={payload}
              label={label}
              formatter={(value) => valueFormatter(value as number)} 
            />
          }
        />
        {showLegend && <RechartsPrimitive.Legend 
          content={({payload}) => payload && <ChartLegendContent payload={payload} />} 
        />}
      </RechartsPrimitive.PieChart>
    </ChartContainer>
  );
};
