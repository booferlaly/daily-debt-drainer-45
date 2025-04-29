
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { ChartContainer } from "./chart-container"
import { ChartTooltipContent, ChartLegendContent } from "./chart-tooltip"

// Bar Chart Component
export const BarChart: React.FC<{
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
}> = ({ 
  data, 
  index, 
  categories, 
  colors = ["#2563eb"], 
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  showLegend = true,
  showXAxis = true,
  showYAxis = true
}) => {
  const chartConfig: any = {};
  
  // Create config for each category
  categories.forEach((category, i) => {
    chartConfig[category] = { color: colors[i % colors.length] };
  });

  return (
    <ChartContainer config={chartConfig}>
      <RechartsPrimitive.BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        {showXAxis && <RechartsPrimitive.XAxis dataKey={index} />}
        {showYAxis && <RechartsPrimitive.YAxis width={yAxisWidth} />}
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
        {categories.map((category, index) => (
          <RechartsPrimitive.Bar 
            key={category}
            dataKey={category} 
            fill={colors[index % colors.length]}
          />
        ))}
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  );
};
