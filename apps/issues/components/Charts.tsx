'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export type ChartData = {
  project: string;
  priority: {
    colour: string;
    key: string;
    value: number;
  }[];
  status: {
    colour: string;
    key: string;
    value: number;
  }[];
  type: {
    colour: string;
    key: string;
    value: number;
  }[];
};

export default function Charts({
  data,
  keys,
}: {
  data: ChartData[];
  keys: { [key: string]: string[] };
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

    const X = d3.map(data, (d) => d.project);

    const XDomain = new d3.InternSet(X);

    const XRange = [margin.left, width - margin.right];

    const XScale = d3.scaleBand(XDomain, XRange);

    const XAxis = d3.axisBottom(XScale);

    element.selectAll('*').remove();

    element.append('g').attr('transform', `translate(0, 0)`).call(XAxis);
  }, [data]);

  return <svg className="h-96 w-full" ref={ref}></svg>;
}
