import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { iconField, imageField } from "../fields/image";
import { bilingual } from "../fields/bilingual";
import { framePresets } from "../media/frames";

const row = (fields: Field[]): Field => ({ type: "row", fields });

const time = (value: string | null | undefined) => !value || /^([01]\d|2[0-3]):[0-5]\d$/.test(value) || "Время в формате 09:00";

const url = (value: string | null | undefined) => !value || /^https:\/\/\S+$/.test(value) || "Ссылка должна начинаться с https://";

export const Seo: GlobalConfig = {
  slug: "seo",
  label: "SEO",
  admin: {
    group: false,
    description:
      "Как сайт выглядит в Google и в превью ссылок (Telegram, Facebook, Viber).",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [afterContentChange],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Поиск и соцсети",
          fields: [
            bilingual({
              name: "title",
              label: "Заголовок страницы (title)",
              required: true,
              maxLength: 70,
              description: "Показывается в поиске и на вкладке браузера. Оптимально 50–60 символов.",
            }),
            bilingual({
              name: "description",
              label: "Описание (description)",
              multiline: true,
              required: true,
              maxLength: 200,
              description: "Текст под заголовком в поиске. Оптимально 140–160 символов.",
            }),
            bilingual({
              name: "keywords",
              label: "Ключевые слова",
              description: "Через запятую. Google их почти не учитывает, но другие поисковики — да.",
            }),
            imageField({
              name: "ogImage",
              label: "Картинка для превью ссылок",
              frames: framePresets.og,
              description: "Показывается, когда ссылку на сайт отправляют в Telegram, Facebook, Viber. Отдаётся как JPG 1200×630.",
            }),
            iconField({
              name: "favicon",
              label: "Иконка сайта (фавиконка)",
              description:
                "Значок во вкладке браузера, в поиске Google и на экране телефона. Из картинки автоматически делаются все размеры. Пусто — стандартная иконка FitSweet.",
            }),
          ],
        },
        {
          label: "Компания для Google",
          fields: [
          {
            name: "business",
            type: "group",
            label: "Компания для Google",
            admin: {
              hideGutter: true,
              description:
                "Из этих данных сайт собирает разметку для Google: адрес, точка на карте, часы, зона доставки. Указывайте те же данные, что в профиле Google Business — название, адрес и телефон должны совпадать везде. Телефон и соцсети берутся из футера.",
            },
            fields: [
              {
                name: "type",
                type: "select",
                label: "Тип компании",
                defaultValue: "Bakery",
                options: [
                  { value: "Bakery", label: "Кондитерская / пекарня" },
                  { value: "Store", label: "Магазин" },
                  { value: "FoodEstablishment", label: "Производство / заведение" },
                ],
                admin: { isClearable: false },
              },
              row([
                { name: "street", type: "text", label: "Улица и дом", admin: { width: "50%", placeholder: "str. Ștefan cel Mare 132" } },
                { name: "city", type: "text", label: "Город", defaultValue: "Chișinău", admin: { width: "25%" } },
                { name: "postalCode", type: "text", label: "Индекс", admin: { width: "25%", placeholder: "MD-2012" } },
              ]),
              { name: "mapPicker", type: "ui", admin: { components: { Field: "/cms/admin/MapPickerField#MapPickerField" } } },
              row([
                { name: "lat", type: "number", label: "Широта", admin: { width: "50%", step: 0.000001 } },
                { name: "lng", type: "number", label: "Долгота", admin: { width: "50%", step: 0.000001 } },
              ]),
              {
                name: "hours",
                type: "array",
                label: "Часы работы",
                labels: { singular: "строка", plural: "строки" },
                admin: {
                  description: "Например: Пн–Пт 09:00–20:00, Сб–Вс 10:00–18:00. Выходной день просто не добавляйте.",
                  components: { RowLabel: "/cms/admin/HoursRowLabel#HoursRowLabel" },
                },
                fields: [
                  row([
                    {
                      name: "days",
                      type: "select",
                      hasMany: true,
                      label: "Дни",
                      required: true,
                      options: [
                        { value: "Monday", label: "Пн" },
                        { value: "Tuesday", label: "Вт" },
                        { value: "Wednesday", label: "Ср" },
                        { value: "Thursday", label: "Чт" },
                        { value: "Friday", label: "Пт" },
                        { value: "Saturday", label: "Сб" },
                        { value: "Sunday", label: "Вс" },
                      ],
                      admin: { width: "50%" },
                    },
                    { name: "opens", type: "text", label: "С", required: true, validate: time, admin: { width: "25%", placeholder: "09:00" } },
                    { name: "closes", type: "text", label: "До", required: true, validate: time, admin: { width: "25%", placeholder: "20:00" } },
                  ]),
                ],
              },
              row([
                {
                  name: "areaServed",
                  type: "text",
                  label: "Зона доставки",
                  defaultValue: "Chișinău",
                  admin: { width: "70%", description: "Через запятую: Chișinău, Durlești, Codru, Stăuceni" },
                },
                {
                  name: "priceRange",
                  type: "select",
                  label: "Цены",
                  options: [
                    { value: "$", label: "$ — недорого" },
                    { value: "$$", label: "$$ — средне" },
                    { value: "$$$", label: "$$$ — дорого" },
                  ],
                  admin: { width: "30%" },
                },
              ]),
              {
                name: "googleProfile",
                type: "text",
                label: "Ссылка на компанию в Google Картах",
                validate: url,
                admin: { placeholder: "https://maps.app.goo.gl/…", description: "Откройте свою компанию в Google Картах → «Поделиться» → скопируйте ссылку." },
              },
              {
                name: "reviewUrl",
                type: "text",
                label: "Ссылка «Оставить отзыв в Google»",
                validate: url,
                admin: {
                  placeholder: "https://g.page/r/…/review",
                  description:
                    "В профиле Google Business → «Попросить отзывы» / «Get more reviews» → скопируйте ссылку. Пока пусто — кнопка отзыва на сайте не показывается.",
                },
              },
            ],
          },
          ],
        },
      ],
    },
  ],
};
