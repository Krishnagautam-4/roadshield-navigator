import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Flame, Landmark, MapPin } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { indexQuery, nationalQuery } from "@/lib/roadshield";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { data: index } = useQuery(indexQuery);
  const { data: national } = useQuery({ ...nationalQuery, enabled: open });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const districts = useMemo(() => {
    if (!index) return [];
    return index.states.flatMap((s) => s.districts.map((d) => ({ district: d, state: s.name, slug: s.slug })));
  }, [index]);

  const go = (slug: string) => {
    onOpenChange(false);
    navigate({ to: "/states/$slug", params: { slug } });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search states, districts or hotspots…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="States & Union Territories">
          {index?.states.map((s) => (
            <CommandItem key={s.slug} value={`state ${s.name}`} onSelect={() => go(s.slug)}>
              <Landmark className="mr-2 h-4 w-4 text-primary" />
              <span>{s.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{s.hotspots} hotspots</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Districts">
          {districts.slice(0, 200).map((d) => (
            <CommandItem
              key={`${d.slug}-${d.district}`}
              value={`district ${d.district} ${d.state}`}
              onSelect={() => go(d.slug)}
            >
              <MapPin className="mr-2 h-4 w-4 text-accent" />
              <span>{d.district}</span>
              <span className="ml-auto text-xs text-muted-foreground">{d.state}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Hotspots">
          {national?.hotspots.map((h) => (
            <CommandItem
              key={h.id}
              value={`hotspot ${h.location} ${h.district} ${h.state ?? ""}`}
              onSelect={() => go(h.stateSlug ?? "")}
            >
              <Flame className="mr-2 h-4 w-4 text-destructive" />
              <span className="truncate">{h.location}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">{h.state}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
