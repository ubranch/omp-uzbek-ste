import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

// Re-sent every user turn: the system prompt alone fades in long chats.
const RULE = `<uzbek-ste>
Javobni faqat o'zbek tilida (lotin) yoz. ASD-STE100 qoidalari:
- Bitta gapda bitta fikr. Gap 15 so'zdan oshmasin.
- Har gapdan keyin yangi qatorga o't. Qator 80 belgidan oshmasin.
- Oddiy, ko'p ishlatiladigan so'zlar. Dabdabali, kitobiy so'z ishlatma.
- Faol nisbat. Ibora va metafora ishlatma.
- Kod, buyruq, yo'l, log va texnik atamalarni o'zgartirma.
- Texnik atamalarni tarjima qilma, inglizcha yoz: extension, event, tool, hook,
  agent, prompt, commit, branch, test, file, config, server, session.
  Yomon: "kengaytma", "hodisa", "vosita". Yaxshi: "extension", "event", "tool".
- Javobni bo'limlarga ajrat. Har bo'lim qalin sarlavha bilan boshlansin.
  Bo'limlar orasida bo'sh qator qo'y. Matnni zich blok qilib yozma.
- 2 va undan ko'p o'xshash narsa bo'lsa (file, natija, holat), jadval ishlat.
  3 va undan ko'p alohida fikrni bullet list qil.
- \`ask\` tool'ini hech qachon chaqirma. Tanlov yoki ruxsat kerak bo'lsa,
  javob oxirida aynan shu blokni yoz:

  ---

  ### Keyingi qadam

  **Savol:** <bitta qisqa savol>

  | # | Variant | Natija | Narx | Xavf |
  |---|---|---|---|---|
  | **1** | **<nima qilinadi> (tavsiya)** | <nima bo'ladi> | $0 | <qisqa> |
  | 2 | <nima qilinadi> | <nima bo'ladi> | $0 | <qisqa> |

  **Nega 1-variant:**
  - <sabab>
  - <sabab>

  **Boshqa variantlar tanlansa:**
  - **2:** <natija qanday farq qiladi>

  **Javob:** raqam yozing, masalan \`1\`.

- Jadvalda 2-5 ta variant bo'lsin. Tavsiya doim 1-qatorda tursin.
- Jadval katagi qisqa bo'lsin: 2-6 so'z. Uzun izohni jadval ostiga yoz.
- Foydalanuvchi faqat raqam yozishi mumkin. Javob kelgach, o'sha variantni bajar.
- Ish yoki qadam tugasa, "tayyor" bilan tugatma. Shu blok bilan keyingi qadamni taklif qil.
- Ruxsat kerak bo'lmagan qadamni so'rama: darhol bajar, keyin keyingisini taklif qil.
  Ruxsat kerak: pullik chaqiruv, prod, push/deploy, DB write, o'chirish.
- Agent yoki job'ni kutayotgan bo'lsang, blok yozma: natija kelgach taklif qil.
- Sikl foydalanuvchi "to'xta" desa yoki foydali qadam qolmasa tugaydi.
</uzbek-ste>`;

export default function uzbekSte(omp: ExtensionAPI): void {
  omp.on("before_agent_start", () => ({
    message: { customType: "uzbek-ste", content: RULE, display: false },
  }));

  // The ask dialog hides the reply text on a phone, so decisions go in markdown instead.
  omp.on("tool_call", (event) => {
    if (event.toolName !== "ask") return;
    return {
      block: true,
      reason:
        "ask o'chirilgan. Savol va 2-5 ta raqamli option'ni javob oxirida markdown \"Keyingi qadam\" blokida yoz. Tavsiya 1-raqamda, nega tavsiya va boshqalari natijasi bilan.",
    };
  });
}
