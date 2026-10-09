import type { InstagramData } from "@/lib/instagram-feed";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { InstagramTiles } from "./InstagramTiles";

export function InstagramFeed({ data }: { data: InstagramData | null }) {
  if (!data) return null;
  const { profile } = data;

  return (
    <section id="instagram" style={{ background: data.background }} className="py-14 sm:py-16 lg:py-20">
      <Container>
        <InstagramTiles tiles={data.tiles} open={data.open} overlay={data.overlay} profile={profile}>
          <SectionTitle align="left" data={data.title} />
          {profile.description && (
            <p style={{ color: profile.textColor }} className="mt-3 max-w-[520px] text-pretty text-[15px] leading-relaxed">
              {profile.description}
            </p>
          )}
        </InstagramTiles>
      </Container>
    </section>
  );
}
