'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export type ChartColours = {
  priority: { [key: string]: string };
  status: { [key: string]: string };
  type: { [key: string]: string };
};

export type ChartData = {
  project: string;
  priority: { [key: string]: number };
  status: { [key: string]: number };
  type: { [key: string]: number };
};

export type ChartKeys = {
  priority: string[];
  status: string[];
  type: string[];
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function Charts({
  colours,
  data,
  keys,
}: {
  colours: ChartColours;
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

    const order = ['priority', 'status', 'type'];

    const stacks = order.map((group) =>
      d3
        .stack()
        .keys(keys[group])
        .value((d, key) => d[group][key])(data)
    );

    const XDomain = new d3.InternSet(d3.map(data, (d) => d.project));
    const YDomain = d3.extent(stacks.flat(3)) as [number, number];
    const ZDomain = new d3.InternSet(order);

    const XScale = d3.scaleBand(XDomain, XRange).paddingInner(0.1);
    const XZScale = d3
      .scaleBand(ZDomain, [0, XScale.bandwidth()])
      .padding(0.05);
    const YScale = d3.scaleLinear(YDomain, YRange);

    const XAxis = d3.axisBottom(XScale);
    const YAxis = d3.axisLeft(YScale).ticks(YDomain[1]);

    element.selectAll('*').remove();

    element
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(YAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', width - margin.left - margin.right)
          .attr('stroke-opacity', 0.25)
      );

    stacks.forEach((stack, stack_idx) => {
      console.log(stack);

      const stackElement = element.append('g');

      stack.forEach((d) => {
        console.log(d);

        const dElement = stackElement
          .append('g')
          .attr('fill', colours[order[stack_idx]][d.key]);

        d.forEach((bar) => {
          console.log(bar);

          const [y1, y2] = bar;
          const {
            data: { project },
          } = bar;

          const barElement = dElement
            .append('rect')
            .attr('x', XScale(project) + XZScale(order[stack_idx]))
            .attr('y', Math.min(YScale(y1), YScale(y2)))
            .attr('height', Math.abs(YScale(y1) - YScale(y2)))
            .attr('width', XZScale.bandwidth());

          barElement
            .append('title')
            .text(
              `${project} - ${capitalize(order[stack_idx])} (${
                d.key
              }): ${Math.abs(y1 - y2)}`
            );
        });
      });
    });

    element
      .append('g')
      .attr('transform', `translate(0, ${YScale(0)})`)
      .call(XAxis);
  }, [colours, data]);

  return <svg className="h-96 w-full" ref={ref}></svg>;
}
