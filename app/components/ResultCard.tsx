import React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

interface ResultCardProps {
  title: string;
  content: string | React.ReactNode;
  defaultOpen?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title, content, defaultOpen = false,
}) => (
  <Accordion type="single" collapsible defaultValue={defaultOpen ? title : undefined}>
    <AccordionItem value={title}>
      <AccordionTrigger className="text-lg font-semibold">{title}</AccordionTrigger>
      <AccordionContent className="text-gray-700 dark:text-gray-300">
        {content}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default ResultCard; 