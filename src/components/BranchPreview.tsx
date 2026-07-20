import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { Specialization } from "@/data/types";
import { tr, type Lang } from "@/lib/i18n";

/**
 * Result bars name a branch the reader may not know yet. Hovering the name
 * previews what it is and where it leads, so they can read the chart without
 * leaving the results.
 */
export function BranchPreview({ branch, lang }: { branch: Specialization; lang: Lang }) {
  return (
    <HoverCard>
      <HoverCardTrigger
        delay={200}
        closeDelay={100}
        render={<button type="button" className="bar-name" />}
      >
        {tr(lang, branch.name)}
      </HoverCardTrigger>
      <HoverCardContent side="top" align="start" className="w-72">
        <p className="preview-name">{tr(lang, branch.name)}</p>
        <p className="preview-desc">{tr(lang, branch.desc)}</p>
        <div className="preview-roles">
          {branch.careers.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
