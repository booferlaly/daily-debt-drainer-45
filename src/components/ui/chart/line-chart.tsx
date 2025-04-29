
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { ChartContainer } from "./chart-container"
import { ChartTooltipContent, ChartLegendContent } from "./chart-tooltip"

// Line Chart Component
export const LineChart: React.FC<{
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
}> = ({ 
  data, 
  index, 
  categories, 
  colors = ["#2563eb"], 
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true
}) => {
  const chartConfig: any = {};
  
  // Create config for each category
  categories.forEach((category, i) => {
    chartConfig[category] = { color: colors[i % colors.length] };
  });

  return (
    <ChartContainer config={chartConfig}>
      <RechartsPrimitive.LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        {showXAxis && <RechartsPrimitive.XAxis dataKey={index} />}
        {showYAxis && <RechartsPrimitive.YAxis width={yAxisWidth} />}
        {showTooltip && <RechartsPrimitive.Tooltip 
          content={({active, payload, label}) => 
            <ChartTooltipContent 
              active={active}
              payload={payload}
              label={label}
              formatter={(value) => valueFormatter(value as number)} 
            />
          }
        />}
        {showLegend && <RechartsPrimitive.Legend 
          content={({payload}) => payload && <ChartLegendContent payload={payload} />} 
        />}
        {categories.map((category, index) => (
          <RechartsPrimitive.Line 
            key={category}
            type="monotone"
            dataKey={category} 
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ fill: colors[index % colors.length], r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsPrimitive.LineChart>
    </ChartContainer>
  );
};
