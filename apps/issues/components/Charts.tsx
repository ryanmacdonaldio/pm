'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export type ChartData = {
  project: string;
  priority: { [key: string]: number };
  status: { [key: string]: number };
  type: { [key: string]: number };
};

export type ChartKeys = {
  priority: { value: string; colour: string }[];
  status: { value: string; colour: string }[];
  type: { value: string; colour: string }[];
};

export default function Charts({
  data,
  keys,
}: {
  data: ChartData[];
  keys: ChartKeys;
}) {
  const ref = useRef<SVGSVGElement>(null);

  const margin = {
    bottom: 25,
    left: 50,
    right: 0,
    top: 25,
  };

  useEffect(() => {
    const element = d3.select(ref.current);
    const { height, width } = ref.current?.getBoundingClientRect() ?? {
      height: 0,
      width: 0,
    };
    const XRange = [margin.left, width - margin.right];
    const YRange = [height - margin.bottom, margin.top];

    const stacks = [
      d3.stack().keys(keys.priority.map((p) => p.value))(
        data.map((d) => d.priority)
      ),
      d3.stack().keys(keys.status.map((s) => s.value))(
        data.map((d) => d.status)
      ),
      d3.stack().keys(keys.type.map((t) => t.value))(data.map((d) => d.type)),
    ];

    const XDomain = new d3.InternSet(d3.map(data, (d) => d.project));
    const YDomain = d3.extent(stacks.flat(3)) as [number, number];

    const XScale = d3.scaleBand(XDomain, XRange);
    const YScale = d3.scaleLinear(YDomain, YRange);

    const XAxis = d3.axisBottom(XScale);
    const YAxis = d3.axisLeft(YScale).ticks(YDomain[1]);

    element.selectAll('*').remove();

    element
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(YAxis);

    element
      .append('g')
      .attr('transform', `translate(0, ${YScale(0)})`)
      .call(XAxis);
  }, [data]);

  return <svg className="h-96 w-full" ref={ref}></svg>;
}
