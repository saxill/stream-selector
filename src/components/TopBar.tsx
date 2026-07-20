import { MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { tr, UI, type Lang } from "@/lib/i18n";

type Props = {
  lang: Lang;
  onLang: (l: Lang) => void;
  onHome: () => void;
  onRestart: () => void;
  inQuiz: boolean;
};

export function TopBar({ lang, onLang, onHome, onRestart, inQuiz }: Props) {
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome}>
        <span className="brand-mark">⟡</span> Stream&nbsp;Select
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<button type="button" className="ghost-btn" aria-label={tr(lang, UI.menu)} />}
        >
          <span className="inline-flex items-center gap-2">
            <MenuIcon className="size-4" />
            {lang === "en" ? "EN" : "हिं"}
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* Base UI requires GroupLabel to live inside its Group/RadioGroup. */}
          <DropdownMenuRadioGroup value={lang} onValueChange={(v) => onLang(v as Lang)}>
            <DropdownMenuLabel>{tr(lang, UI.language)}</DropdownMenuLabel>
            {/* Radio items keep the menu open by default; picking a language is
                a one-shot choice, so close on click. */}
            <DropdownMenuRadioItem value="en" closeOnClick>
              {tr(lang, UI.english)}
              <DropdownMenuShortcut>
                <Kbd>L</Kbd>
              </DropdownMenuShortcut>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="hi" closeOnClick>
              {tr(lang, UI.hinglish)}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onRestart}>
            {inQuiz ? tr(lang, UI.switchTrack) : tr(lang, UI.restart)}
            <DropdownMenuShortcut>
              <Kbd>R</Kbd>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
