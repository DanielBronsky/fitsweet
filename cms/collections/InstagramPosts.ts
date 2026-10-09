import { ValidationError, type CollectionBeforeValidateHook, type CollectionConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { imageField } from "../fields/image";
import { framePresets } from "../media/frames";
import { importInstagramCover, locateInstagramMedia, parseInstagramUrl } from "../instagram";

type Cover = { image?: number | { id: number } | null; crops?: unknown } | null | undefined;

const coverId = (cover: Cover) => {
  const image = cover?.image;
  return image && typeof image === "object" ? image.id : (image ?? null);
};

const fillFromInstagram: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data) return data;
  const parsed = parseInstagramUrl(data.url);
  if (!parsed) return data;

  data.code = parsed.code;
  data.kind = data.kind && originalDoc?.code === parsed.code ? data.kind : parsed.kind;

  const linkChanged = originalDoc?.code !== parsed.code;
  const coverTouched = coverId(data.cover) !== coverId(originalDoc?.cover);
  const needsCover = !coverId(data.cover) || (linkChanged && !coverTouched);

  if (needsCover) {
    const imported = await importInstagramCover(req.payload, parsed.code, req);
    if (imported) {
      data.kind = imported.kind;
      data.cover = { image: imported.mediaId, crops: null };
    } else if (!coverId(data.cover)) {
      throw new ValidationError({
        collection: "instagramPosts",
        errors: [
          {
            path: "cover.image",
            message: "Instagram не отдал обложку. Загрузите её вручную (скриншот поста) — ссылка останется рабочей.",
          },
        ],
      });
    }
  }

  data.name = `${data.kind === "reel" ? "Видео" : "Фото"} · ${parsed.code}`;
  return data;
};

export const InstagramPosts: CollectionConfig = {
  slug: "instagramPosts",
  labels: { singular: "Пост Instagram", plural: "Посты Instagram" },
  orderable: true,
  admin: {
    group: false,
    useAsTitle: "name",
    defaultColumns: ["name", "kind", "show"],
    description: "Вставьте ссылку на пост или видео — обложка и тип подтянутся сами. Порядок — перетаскиванием в списке.",
  },
  access: { read: () => true },
  endpoints: [
    {
      path: "/import-cover",
      method: "post",
      handler: async (req) => {
        if (!req.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const body = ((await req.json?.().catch(() => null)) ?? {}) as { url?: string; current?: number | null };
        const parsed = parseInstagramUrl(body.url);
        if (!parsed) return Response.json({ error: "bad-url" }, { status: 400 });
        if (body.current) {
          const media = await req.payload.findByID({ collection: "media", id: body.current, depth: 0, req }).catch(() => null);
          if (media?.filename && (!media.filename.startsWith("instagram-") || media.filename.startsWith(`instagram-${parsed.code}`))) {
            const located = await locateInstagramMedia(parsed.code);
            return Response.json({
              code: parsed.code,
              kept: true,
              own: !media.filename.startsWith("instagram-"),
              kind: located?.kind,
              thumb: media.thumbnailURL ?? media.url,
              width: media.width,
              height: media.height,
            });
          }
        }
        const imported = await importInstagramCover(req.payload, parsed.code, req);
        if (!imported) return Response.json({ code: parsed.code, error: "not-found" });
        const media = await req.payload.findByID({ collection: "media", id: imported.mediaId, depth: 0, req });
        return Response.json({
          code: parsed.code,
          kind: imported.kind,
          mediaId: imported.mediaId,
          thumb: media.thumbnailURL ?? media.url,
          width: media.width,
          height: media.height,
        });
      },
    },
  ],
  hooks: {
    beforeValidate: [fillFromInstagram],
    afterChange: [afterContentChange],
    afterDelete: [afterContentChange],
  },
  fields: [
    { name: "name", type: "text", label: "Пост", admin: { hidden: true } },
    { name: "show", type: "checkbox", label: "Показывать на сайте", defaultValue: true, admin: { position: "sidebar" } },
    {
      name: "url",
      type: "text",
      label: "Ссылка на пост или видео в Instagram",
      required: true,
      admin: {
        placeholder: "https://www.instagram.com/p/DIvZ5VSMdcF/",
        components: { Field: "/cms/admin/InstagramUrlField#InstagramUrlField" },
      },
      validate: (value: string | null | undefined) =>
        parseInstagramUrl(value) ? true : "Нужна ссылка вида https://www.instagram.com/p/… или https://www.instagram.com/reel/…",
    },
    { name: "code", type: "text", admin: { hidden: true } },
    {
      name: "kind",
      type: "select",
      label: "Тип",
      defaultValue: "post",
      options: [
        { value: "post", label: "Фото" },
        { value: "reel", label: "Видео" },
      ],
      admin: { position: "sidebar", description: "Определяется сам по ссылке. У видео на плитке значок ▶." },
    },
    imageField({
      name: "cover",
      label: "Обложка",
      frames: framePresets.instagramTile,
      description: "Подставляется из Instagram сразу после вставки ссылки. Можно поправить обрезку или заменить своей картинкой.",
    }),
  ],
};
