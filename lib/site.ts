/**
 * Single source of truth for clinic facts, pricing and copy.
 * Everything the site claims about the practice lives here so figures
 * (fees, rebates, success rates) can never drift between sections.
 */

export const clinic = {
  name: "Perth Sweat Clinic",
  tagline: "Hyperhidrosis treatment, led by a cardiothoracic surgeon.",
  phone: "1300 079 328",
  phoneHref: "tel:1300079328",
  email: "contact@perthsweatclinic.com.au",
  emailHref: "mailto:contact@perthsweatclinic.com.au",
  url: "https://perthsweatclinic.com.au",
  address: {
    suite: "Suite 35, 146 Mounts Bay Rd",
    locality: "Perth",
    region: "WA",
    postcode: "6000",
    country: "Australia",
  },
  addressLine: "Suite 35, 146 Mounts Bay Rd, Perth WA 6000",
  hours: [
    { days: "Monday – Thursday", time: "8:00am – 4:30pm" },
    { days: "Friday", time: "8:00am – 1:30pm" },
    { days: "Saturday – Sunday", time: "Closed" },
  ],
  openingHoursSpec: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "16:30" },
    { days: ["Friday"], opens: "08:00", closes: "13:30" },
  ],
  social: {
    facebook: "https://www.facebook.com/perthsweatclinic",
  },
} as const;

export const doctor = {
  name: "Dr Sanjay Sharma",
  role: "Founder & Lead Specialist",
  quals: "MBBS (UWA), FRACS (Cardiothoracic Surgery)",
  quote:
    "The delight of shaking a patient's dry hand after surgery is one of the most gratifying aspects of being a surgeon.",
  intro:
    "Not a beauty clinic. Hyperhidrosis here is treated as a surgical sub-specialty by one of Perth's busiest cardiothoracic surgeons — someone who operates inside the chest almost every working day.",
  bio: [
    "Born in the United States and raised in Perth, Dr Sharma trained in medicine at the University of Western Australia before completing a cardiothoracic fellowship at Harvard Medical School in Boston.",
    "He commenced practice in Perth in 2004 at Mount Hospital and Fremantle Hospital, and went on to serve as Head of Department, Cardiothoracic Surgery at Fremantle Hospital from 2011 to 2015 before transferring to Fiona Stanley Hospital.",
    "He established the thoracic surgical programs at St John of God Murdoch in 2012 and at Joondalup Health Campus. His broader practice covers cardiac surgery — bypass, valve repair and replacement, aneurysm repair — alongside minimally invasive lung cancer surgery.",
  ],
  credentials: [
    {
      label: "Harvard Medical School",
      detail: "Cardiothoracic Fellow, Boston MA",
    },
    {
      label: "FRACS",
      detail: "Fellow, Royal Australasian College of Surgeons — Cardiothoracic",
    },
    {
      label: "Curtin Medical School",
      detail: "Associate Adjunct Clinical Professor",
    },
    {
      label: "Fremantle Hospital",
      detail: "Head of Department, Cardiothoracic Surgery 2011–2015",
    },
  ],
  milestones: [
    { year: "2004", event: "Commenced practice in Perth — Mount Hospital and Fremantle Hospital" },
    { year: "2011", event: "Appointed Head of Department, Cardiothoracic Surgery, Fremantle Hospital" },
    { year: "2012", event: "Established the thoracic surgical program at St John of God Murdoch" },
    { year: "2015", event: "Transferred to Fiona Stanley Hospital; established the Joondalup program" },
  ],
} as const;

export type ConditionId = "hands" | "underarms" | "face";

export const conditions: {
  id: ConditionId;
  label: string;
  clinical: string;
  headline: string;
  lede: string;
  lived: string[];
  treatment: string;
  treatmentHref: string;
}[] = [
  {
    id: "hands",
    label: "Sweaty hands",
    clinical: "Palmar hyperhidrosis",
    headline: "You have stopped offering your hand.",
    lede:
      "Palmar hyperhidrosis is driven by an overactive sympathetic nerve chain sitting over the 2nd and 3rd ribs. It is not nerves, not anxiety, and not something you can dry your way out of.",
    lived: [
      "Dreading a handshake long before it happens",
      "Wiping your palms on your clothes without thinking",
      "Smudged paper, slippery tools, damaged keyboards and phones",
      "Choosing where to sit, what to hold, who to greet",
    ],
    treatment: "Endoscopic Thoracic Sympathectomy (ETS)",
    treatmentHref: "#ets",
  },
  {
    id: "underarms",
    label: "Sweaty underarms",
    clinical: "Axillary hyperhidrosis",
    headline: "You dress around it, every single morning.",
    lede:
      "Axillary hyperhidrosis comes from overactive eccrine sweat glands in the underarm, often paired with apocrine glands that carry odour. Both can be removed permanently, without surgery.",
    lived: [
      "A second shirt in your bag, always",
      "Ruling out colours, fabrics and anything fitted",
      "Keeping your arms down in meetings, photos, greetings",
      "Antiperspirants that stopped working years ago",
    ],
    treatment: "miraDry",
    treatmentHref: "#miradry",
  },
  {
    id: "face",
    label: "Sweaty face & blushing",
    clinical: "Craniofacial hyperhidrosis",
    headline: "It shows before you have said a word.",
    lede:
      "Craniofacial hyperhidrosis produces sweat across the head and face, and frequently travels with facial blushing. Both are driven by the same sympathetic pathway that controls the hands.",
    lived: [
      "Sweat stinging your eyes mid-conversation",
      "Makeup that will not last the morning",
      "Being asked if you are unwell, or nervous",
      "Blushing that arrives faster than you can explain it",
    ],
    treatment: "Endoscopic Thoracic Sympathectomy (ETS)",
    treatmentHref: "#ets",
  },
];

export const conditionFacts = [
  { stat: "~3%", label: "of the general population live with hyperhidrosis" },
  { stat: "~5%", label: "prevalence in people of Asian descent" },
  { stat: "~50%", label: "of patients have a parent with the same condition" },
  { stat: "Early teens", label: "when symptoms most commonly begin" },
];

export const journey = [
  {
    step: "01",
    title: "Consultation",
    body:
      "An appointment with Dr Sharma directly — in the Mounts Bay Rd suite, or by phone or video if you are regional. He examines the pattern, severity and history of your sweating.",
    meta: "$300 · Medicare rebate $86.15 with a valid GP referral",
  },
  {
    step: "02",
    title: "Diagnosis",
    body:
      "Confirming the sub-type — palmar, axillary or craniofacial — and ruling out secondary causes. Which area is affected determines which treatment is appropriate.",
    meta: "In person, phone or video",
  },
  {
    step: "03",
    title: "Treatment plan",
    body:
      "Surgery is not the first answer for everyone. ETS is offered once conservative treatments have failed; miraDry is the non-surgical route for underarms. You will be told plainly which applies to you.",
    meta: "Risks and alternatives discussed in full",
  },
  {
    step: "04",
    title: "Procedure day",
    body:
      "For ETS: admitted around 6:30am, surgery around 8:00am, discharged by about 1:00pm — the same day. For miraDry: a single 60–90 minute appointment at the Mount Hospital suite.",
    meta: "Day procedure — no overnight stay",
  },
  {
    step: "05",
    title: "Recovery",
    body:
      "After ETS: about an hour in recovery, a chest X-ray to confirm the lung has fully expanded, then home with simple painkillers. After miraDry: ice packs, some swelling that settles.",
    meta: "Home the same day",
  },
  {
    step: "06",
    title: "Results",
    body:
      "With ETS, dry hands are visible in theatre — before you have left the operating room. With miraDry, sweat and odour glands are destroyed permanently and do not regenerate.",
    meta: "Follow-up at 3 weeks",
  },
];

export const etsSteps = [
  {
    title: "A single 5mm incision per side",
    body:
      "Keyhole access under general anaesthetic, delivered through a laryngeal mask rather than a tube down the throat.",
  },
  {
    title: "Camera-guided, inside the chest",
    body:
      "An endoscope locates the sympathetic nerve chain running over the 2nd and 3rd ribs — the pathway driving the sweat glands in your hands and face.",
  },
  {
    title: "The lung is not deflated",
    body:
      "Dr Sharma is one of few surgeons able to perform the procedure without collapsing the lung, which meaningfully shortens recovery.",
  },
  {
    title: "The nerve pathway is ablated",
    body:
      "The overactive segment is cauterised. The signal telling those glands to sweat simply stops arriving.",
  },
  {
    title: "Dry hands, seen in theatre",
    body:
      "The change is immediate and visible on the operating table — not something you wait weeks to find out about.",
  },
];

export const etsRisks = [
  {
    title: "Compensatory hyperhidrosis",
    body:
      "Increased sweating across the trunk or back, reported by up to around 40% of patients. Usually mild, but it is the most common trade-off and worth weighing carefully.",
  },
  {
    title: "Over-dry hands",
    body: "Hands can end up drier than expected. Manageable, and generally preferred to the alternative.",
  },
  {
    title: "Pneumothorax or pleural inflammation",
    body: "Air or irritation in the chest cavity. The post-operative chest X-ray exists to catch this.",
  },
  {
    title: "Gustatory hyperhidrosis",
    body: "Sweating triggered by eating, particularly with strongly flavoured food.",
  },
  {
    title: "Horner's syndrome",
    body: "A drooping eyelid and constricted pupil from injury to nearby nerves. Extremely rare.",
  },
  {
    title: "Bradycardia",
    body: "A slowed resting heart rate, as the same nerve chain contributes to heart rate regulation.",
  },
];

export const miradrySteps = [
  {
    title: "Local anaesthetic",
    body: "The underarm is numbed thoroughly before anything begins. Most patients describe the procedure itself as comfortable.",
  },
  {
    title: "Microwave energy, precisely placed",
    body:
      "Energy is delivered just beneath the skin, at the exact depth where sweat and odour glands sit, while the skin surface is cooled and protected.",
  },
  {
    title: "The glands are destroyed",
    body:
      "Eccrine (sweat) glands, apocrine (odour) glands and hair follicles in the treated area are eliminated. None of them regenerate.",
  },
  {
    title: "60–90 minutes, then home",
    body: "Ice packs afterwards. Some swelling, redness or altered sensation that settles over the following days.",
  },
];

export const treatments = [
  {
    id: "ets",
    name: "ETS",
    fullName: "Endoscopic Thoracic Sympathectomy",
    treats: "Sweaty hands · Sweaty face · Facial blushing · Raynaud's disease",
    summary:
      "The clinic's flagship surgical procedure, offered once conservative treatments have failed. Minimally invasive keyhole surgery that permanently interrupts the overactive nerve signal.",
    points: [
      "Day procedure — admitted ~6:30am, home by ~1:00pm",
      "Single 5mm incision per side",
      "Lung is not deflated — faster recovery",
      "Dry hands visible in theatre",
    ],
    price: "Fully covered by private health funds",
    priceNote: "Initial consultation $300 with a valid GP referral",
    href: "#ets",
  },
  {
    id: "miradry",
    name: "miraDry",
    fullName: "Non-surgical underarm treatment",
    treats: "Sweaty underarms · Underarm odour · Underarm hair",
    summary:
      "A non-invasive, in-office procedure using microwave energy to permanently destroy underarm sweat and odour glands. No surgery, no incisions, no downtime.",
    points: [
      "60–90 minutes, in-office",
      "85% of patients need one treatment only",
      "TGA-approved (2014) and FDA-approved (2011)",
      "Permanent — glands do not regenerate",
    ],
    price: "$2,900",
    priceNote: "Complete treatment · second treatment if needed $2,400",
    href: "#miradry",
  },
  {
    id: "consult",
    name: "Consultation",
    fullName: "In person, by phone or by video",
    treats: "All three hyperhidrosis sub-types · Second opinions",
    summary:
      "Every treatment starts here, with Dr Sharma directly rather than a nurse or coordinator. Phone and video consultations are available if travelling to Perth is impractical.",
    points: [
      "Directly with Dr Sharma",
      "Available anywhere in WA and regionally",
      "Medicare rebate $86.15 with a valid GP referral",
      "Honest advice on whether a procedure suits you",
    ],
    price: "$300",
    priceNote: "Medicare rebate $86.15 with a valid GP referral",
    href: "#contact",
  },
];

export const trustStats = [
  { value: "85%", label: "of miraDry patients need one treatment only", detail: "Treated at level 5" },
  { value: "Same day", label: "discharge after ETS surgery", detail: "In at 6:30am, home by 1:00pm" },
  { value: "TGA + FDA", label: "approved miraDry technology", detail: "TGA 2014 · FDA 2011" },
  { value: "Permanent", label: "results — glands do not regenerate", detail: "No maintenance treatments" },
];

/**
 * Consented patient stories.
 *
 * Intentionally empty. Testimonials are powerful here, but they have to be
 * real and consented — nothing on this site should be invented on a
 * patient's behalf. Add entries as written consent is obtained and the
 * "Patient stories" block appears automatically; leave it empty and the
 * block stays hidden rather than showing a placeholder.
 *
 * Keep them anonymised (first name and age, or initials) unless the patient
 * has explicitly agreed to be identified.
 */
export const patientStories: {
  quote: string;
  attribution: string;
  treatment: string;
}[] = [];

export const pricing = [
  {
    name: "Initial consultation",
    price: "$300",
    note: "Medicare rebate of $86.15 applies with a valid GP referral.",
    items: [
      "Directly with Dr Sharma",
      "In person, phone or video",
      "Diagnosis and treatment plan",
      "Full discussion of risks and alternatives",
    ],
  },
  {
    name: "miraDry",
    price: "$2,900",
    note: "Complete treatment. If a second treatment is required, it is $2,400.",
    featured: true,
    items: [
      "Non-surgical, in-office, 60–90 minutes",
      "Permanent removal of sweat and odour glands",
      "85% of patients need one treatment only",
      "Performed at the Mount Hospital suite",
    ],
  },
  {
    name: "ETS surgery",
    price: "Fund covered",
    note: "Fully covered by private health funds. Consultation billed separately at $300.",
    items: [
      "Day-procedure keyhole surgery",
      "Performed at accredited private hospitals",
      "Includes post-operative chest X-ray",
      "Three-week follow-up appointment",
    ],
  },
];

export const locations = {
  clinic: {
    name: "Consulting suite",
    address: "Suite 35, 146 Mounts Bay Rd, Perth WA 6000",
    note: "Consultations and miraDry treatments.",
  },
  hospitals: [
    { name: "Mount Hospital", suburb: "Perth", note: "ETS surgery and miraDry suite" },
    { name: "St John of God Murdoch", suburb: "Murdoch", note: "ETS surgery" },
    { name: "Joondalup Health Campus", suburb: "Joondalup", note: "ETS surgery" },
    { name: "Hollywood Hospital", suburb: "Nedlands", note: "ETS surgery" },
  ],
};

export const faqs = [
  {
    q: "How many treatments will I need?",
    a: "For miraDry, 85% of patients need only a single treatment when treated at level 5. Around 15% require a second, which is charged at $2,400. ETS is a one-time surgical procedure.",
  },
  {
    q: "Is it painful?",
    a: "miraDry is performed under local anaesthetic and most patients find it comfortable. Expect some swelling, redness or altered sensation afterwards, which settles. ETS is performed under general anaesthetic; afterwards, simple painkillers are usually all that is needed.",
  },
  {
    q: "Are the results permanent?",
    a: "Yes. miraDry destroys the sweat and odour glands in the treated area, and those glands do not regenerate. ETS permanently interrupts the sympathetic nerve pathway driving the sweating.",
  },
  {
    q: "Do I need a GP referral?",
    a: "You can be seen without one, but a valid GP referral entitles you to a Medicare rebate of $86.15 on the $300 consultation fee. It is worth arranging before your appointment.",
  },
  {
    q: "Will private health insurance cover the surgery?",
    a: "ETS is fully covered by private health funds. The initial consultation is billed separately at $300, with the Medicare rebate applying where you hold a valid referral.",
  },
  {
    q: "What is compensatory sweating?",
    a: "After ETS, up to around 40% of patients notice increased sweating elsewhere — typically the trunk or back. It is usually mild, but it is a genuine trade-off and Dr Sharma will discuss it with you in full before you decide.",
  },
  {
    q: "Do I have to travel to Perth for the consultation?",
    a: "No. Phone and video consultations with Dr Sharma are available, which is what most regional WA patients do. Travel is only necessary for the procedure itself.",
  },
  {
    q: "How soon will I see results?",
    a: "With ETS, hands are dry in theatre — the change is visible before you leave the operating room. With miraDry, the reduction in sweat and odour is immediate, with the full result settling over the following weeks.",
  },
  {
    q: "Will ETS help with facial blushing?",
    a: "Yes. The same sympathetic pathway drives craniofacial sweating and facial blushing, so ablating it addresses both. ETS is also used to treat Raynaud's disease.",
  },
];

export const articles = [
  {
    title: "What makes our sweat stink?",
    excerpt:
      "Sweat itself is close to odourless. Understanding what actually creates body odour explains why treating the apocrine glands matters as much as treating the sweat.",
    topic: "The science",
  },
  {
    title: "The long-term effects of excessive sweating",
    excerpt:
      "Beyond daily inconvenience, untreated hyperhidrosis carries a real risk of secondary skin infection — including bromhidrosis in severe cases.",
    topic: "Health",
  },
  {
    title: "Hiding and reducing underarm sweat",
    excerpt:
      "The strategies people use before seeking treatment — what genuinely helps, what only appears to, and the point at which it is worth escalating.",
    topic: "Living with it",
  },
  {
    title: "The emotional impact of living with hyperhidrosis",
    excerpt:
      "Social withdrawal, avoidance and anxiety are the most under-discussed part of this condition, and often the reason patients finally seek help.",
    topic: "Living with it",
  },
];

export const navLinks = [
  { label: "The condition", href: "#conditions" },
  { label: "Dr Sharma", href: "#doctor" },
  { label: "Treatments", href: "#treatments" },
  { label: "Your journey", href: "#journey" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];
