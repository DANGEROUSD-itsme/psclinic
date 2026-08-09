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
  photo: "/team/dr-sanjay-sharma.jpg",
  quals: "MBBS (UWA), FRACS (Cardiothoracic Surgery)",
  quote:
    "The delight of shaking a patient's dry hand after surgery is one of the most gratifying aspects of being a surgeon.",
  intro:
    "Not a beauty clinic. Hyperhidrosis here is treated as a surgical sub-specialty by one of Perth's busiest cardiothoracic surgeons, someone who operates inside the chest almost every working day.",
  bio: [
    "Born in the United States, Dr Sharma migrated to Perth as a young child and was schooled at Duncraig Senior High School before completing his medical degree at the University of Western Australia in 1992.",
    "He undertook a six-year surgical training program in cardiothoracic surgery at Royal Perth Hospital, along with further training in the Eastern States and New Zealand, before obtaining his Fellowship in 2002 at age 32, one of the youngest cardiothoracic surgeons in Australia at the time.",
    "He then completed post-fellowship training at Brigham and Women's Hospital, Harvard Medical School, in Boston through 2002 and 2003, training under Professor Lawrence Cohn, the Virginia and James Hubbard Professor of Cardiac Surgery at Harvard. That training covered advanced minimally invasive valve surgery, transplantation, blood conservation and lung cancer surgery, and is where his interest in surgical treatment for hyperhidrosis began.",
    "He commenced practice back in Perth in 2004 at Mount Hospital and Fremantle Hospital, and went on to serve as Head of Department, Cardiothoracic Surgery at Fremantle Hospital from 2011 to 2015, introducing blood conservation principles that measurably reduced transfusion requirements for surgical patients there, before the department transferred to Fiona Stanley Hospital.",
    "He established the thoracic surgical programs at St John of God Murdoch in 2012 and at Joondalup Health Campus in 2015, and continues to hold regular operating lists at all three: Mount Hospital, St John of God Murdoch and Joondalup Health Campus. His broader practice covers cardiac surgery (bypass, valve repair and replacement, aneurysm repair) alongside minimally invasive lung cancer surgery, and he has published and presented extensively in peer-reviewed journals.",
  ],
  credentials: [
    {
      label: "Harvard Medical School",
      detail: "Post-fellowship training, Brigham and Women's Hospital, Boston MA",
    },
    {
      label: "FRACS",
      detail: "Fellowship obtained 2002, age 32 · Royal Australasian College of Surgeons",
    },
    {
      label: "Curtin Medical School",
      detail: "Associate Adjunct Clinical Professor",
    },
    {
      label: "Fremantle Hospital",
      detail: "Head of Department, Cardiothoracic Surgery 2011–2015",
    },
    {
      label: "The Mount Hospital",
      detail: "Medical Advisory Committee and Clinical Review Committee",
    },
    {
      label: "Royal College of Surgeons",
      detail: "Senior Instructor",
    },
  ],
  milestones: [
    { year: "1992", event: "Completed his medical degree (MBBS) at the University of Western Australia" },
    { year: "2002", event: "Obtained his FRACS Fellowship at age 32, then trained at Brigham and Women's Hospital, Harvard Medical School" },
    { year: "2004", event: "Commenced practice in Perth: Mount Hospital and Fremantle Hospital" },
    { year: "2011", event: "Appointed Head of Department, Cardiothoracic Surgery, Fremantle Hospital" },
    { year: "2012", event: "Established the thoracic surgical program at St John of God Murdoch" },
    { year: "2015", event: "Department transferred to Fiona Stanley Hospital; established the Joondalup Health Campus program" },
  ],
} as const;

/**
 * The wider care team — Dr Sharma leads the practice, but he is not the
 * only person a patient deals with. Rishi's role, qualifications and career
 * history are drawn from his own first-person bio on the clinic's "About
 * Us" page.
 */
export const careTeam = [
  {
    name: "Rishi Barot",
    role: "Clinical Nurse Coordinator",
    photo: "/team/rishi-barot.png",
    quals:
      "B.Sc. Nursing, Curtin University (2007–2011) · Grad. Cert. Clinical Nursing, University of Notre Dame Fremantle (2013)",
    summary:
      "Began as a Graduate Registered Nurse at The Mount Hospital in 2012, working in the operating theatre and on the surgical cardiothoracic and vascular wards, before moving into clinical coordination. Now coordinates patient care around every procedure at the clinic: the person most patients speak with between their consultation and their procedure day.",
  },
] as const;

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
    treatmentHref: "/#ets",
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
    treatmentHref: "/#miradry",
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
    treatmentHref: "/#ets",
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
      "An appointment with Dr Sharma directly, in the Mounts Bay Rd suite, or by phone or video if you are regional. He examines the pattern, severity and history of your sweating.",
    meta: "$300 · Medicare rebate $86.15 with a valid GP referral",
  },
  {
    step: "02",
    title: "Diagnosis",
    body:
      "Confirming the sub-type (palmar, axillary or craniofacial) and ruling out secondary causes. Which area is affected determines which treatment is appropriate.",
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
      "ETS is a day procedure: you are admitted, treated and discharged the same day, with no overnight stay. miraDry is a single in-office appointment of around 60–90 minutes. Exact timing on the day is confirmed with you beforehand, not estimated here.",
    meta: "Day procedure, no overnight stay",
  },
  {
    step: "05",
    title: "Recovery",
    body:
      "After ETS, a short period in recovery and a chest X-ray precede discharge, with simple painkillers usually all that is needed afterwards. After miraDry, ice packs are applied and any swelling settles over the following days.",
    meta: "Home the same day",
  },
  {
    step: "06",
    title: "Results",
    body:
      "Many ETS patients notice a difference as soon as they wake from surgery. With miraDry, sweat and odour glands are destroyed permanently and do not regenerate. The specifics of what to expect for you are covered in your consultation, not generalised here.",
    meta: "Follow-up at 3 weeks",
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
      "Day procedure, home the same day",
      "Minimally invasive keyhole technique",
      "General anaesthetic, in an accredited hospital",
      "Full explanation of technique and risks at consultation",
    ],
    price: "Fully covered by private health funds",
    priceNote: "Initial consultation $300 with a valid GP referral",
    href: "/#ets",
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
      "Permanent, glands do not regenerate",
    ],
    price: "$2,900",
    priceNote: "Complete treatment · second treatment if needed $2,400",
    href: "/#miradry",
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
    href: "/#contact",
  },
];

export const trustStats = [
  { value: "85%", label: "of miraDry patients need one treatment only", detail: "Treated at level 5" },
  { value: "Same day", label: "discharge after ETS surgery", detail: "No overnight hospital stay" },
  { value: "TGA + FDA", label: "approved miraDry technology", detail: "TGA 2014 · FDA 2011" },
  { value: "Permanent", label: "results, glands do not regenerate", detail: "No maintenance treatments" },
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
    a: "After ETS, up to around 40% of patients notice increased sweating elsewhere, typically the trunk or back. It is usually mild, but it is a genuine trade-off and Dr Sharma will discuss it with you in full before you decide.",
  },
  {
    q: "Do I have to travel to Perth for the consultation?",
    a: "No. Phone and video consultations with Dr Sharma are available, which is what most regional WA patients do. Travel is only necessary for the procedure itself.",
  },
  {
    q: "How soon will I see results?",
    a: "Many ETS patients notice a difference as soon as they wake from surgery. With miraDry, the reduction in sweat and odour is immediate, with the full result settling over the following weeks. Dr Sharma will give you a realistic picture specific to you at your consultation.",
  },
  {
    q: "Will ETS help with facial blushing?",
    a: "Yes. The same sympathetic pathway drives craniofacial sweating and facial blushing, so ablating it addresses both. ETS is also used to treat Raynaud's disease.",
  },
];

/**
 * Blog posts, hosted natively at /blog/<slug> rather than linking out.
 *
 * `body` is adapted from the clinic's own published posts — reworked into
 * full paragraphs, but built strictly from the same verified facts pulled
 * from those articles, nothing added beyond them. It is not a verbatim
 * copy: this environment could not fetch the original page text or images
 * directly (network policy blocks perthsweatclinic.com.au entirely), only
 * search-indexed summaries of their content. `sourceUrl` stays attached to
 * every post and is shown on the page itself for that reason — full
 * attribution, and a place to send anyone who wants the original.
 *
 * No images: none could be fetched from the original either, and nothing
 * here should stand in as if it were the real photography. Each post gets
 * a plain colour-band header instead of a fabricated stock photo.
 */
export const articles = [
  {
    slug: "why-does-our-sweat-stink",
    title: "Why Does Our Sweat Stink?",
    excerpt:
      "Sweat itself is close to odourless. The smell comes from skin bacteria breaking it down. Stress, synthetic fabrics and diet all change how much there is to break down.",
    topic: "The science",
    sourceUrl: "https://www.perthsweatclinic.com.au/blog/what-makes-our-sweat-stink/",
    body: [
      "Sweat itself is close to odourless. The smell most people associate with it is actually produced by bacteria on the skin, groups including Corynebacteriaceae, Staphylococcaceae and Propionibacteriaceae, feeding on the substances in sweat and breaking them down into smaller chemical compounds. Those compounds evaporate easily, which is exactly what lets them reach the nose.",
      "How much odour that process produces depends on more than just how much you sweat. Stress pushes sweat glands into a higher gear, increasing both the volume of sweat and the odour that follows. Fabric choice matters too: synthetic materials like polyester, nylon and silk are less breathable than natural fibres, which keeps bacteria trapped against the skin rather than letting air move through.",
      "Diet plays a role as well: a diet lacking in leafy greens and nuts tends to produce worse body odour than a more balanced one. Even some deodorants can work against you, inadvertently giving the bacteria responsible for odour more fuel rather than less.",
      "Age changes the picture too. As people get older, their apocrine glands slow down, which is part of why body odour becomes less pronounced later in life. For axillary hyperhidrosis specifically, where both sweat and odour-producing glands are overactive, miraDry addresses the mechanism directly rather than managing the symptoms day to day.",
    ],
  },
  {
    slug: "impact-of-hyperhidrosis-on-patients",
    title: "Understanding the Impact of Hyperhidrosis on Patients",
    excerpt:
      "Quality-of-life studies put the impact of hyperhidrosis on par with rheumatoid arthritis or depression. Patients report avoiding handshakes and presentations, and choosing careers below their potential.",
    topic: "Living with it",
    sourceUrl: "https://www.perthsweatclinic.com.au/blog/impact-of-hyperhidrosis-on-patients/",
    body: [
      "When patients with severe hyperhidrosis are asked about the functional, psychological and social impact of their condition, the studies are consistent: the effect on quality of life is comparable to other chronic conditions taken far more seriously by the people around the person living with them, conditions like rheumatoid arthritis, depression or inflammatory bowel disease.",
      "A lot of what makes hyperhidrosis so disruptive happens quietly, well before anyone else notices anything. A meaningful part of a patient's day can be spent simply concealing the condition: planning what to wear, when to reapply antiperspirant, which seat to take in a meeting. Avoiding a handshake or declining to give a presentation is rarely read for what it is; more often it is interpreted by employers and colleagues as disinterest, laziness or a lack of confidence.",
      "That misreading has real consequences. Patients frequently steer their careers around it, choosing roles below their actual potential specifically to avoid the interactions most likely to trigger visible sweating. And it does not switch off at the end of the day. Many patients describe lying awake running through how they are going to manage or conceal the condition tomorrow, which is its own quiet toll.",
      "None of this is an overreaction to a cosmetic inconvenience. It is a recognised medical condition with a measurable effect on daily life, which is exactly why it is treated here as a surgical and medical sub-specialty rather than something to simply manage around.",
    ],
  },
  {
    slug: "long-term-effects-of-excessive-sweating",
    title: "Long-Term Effects of Excessive Sweating",
    excerpt:
      "Constant wetness can macerate the skin and lead to secondary bacterial infection. Long-term use of aluminium chloride antiperspirants carries its own risk of chronic, eczema-like irritation.",
    topic: "Health",
    sourceUrl: "https://www.perthsweatclinic.com.au/blog/long-term-effects-excessive-sweating/",
    body: [
      "The most immediate effects of excessive sweating are psychological: distress, embarrassment, social anxiety. But left untreated for years, hyperhidrosis carries physical consequences too, not just emotional ones.",
      "Constant wetness on the hands, face or underarms softens and breaks down the outer layer of skin, a process called maceration. Macerated skin is more vulnerable to secondary bacterial infection, which can progress to bromhidrosis, a persistent, medically recognised odour condition distinct from ordinary body odour.",
      "There is also a less obvious risk in how people try to manage the condition themselves before seeking treatment. Long-term, heavy use of aluminium chloride antiperspirants (often applied more frequently and at higher strength than the product is designed for, out of understandable desperation) can inflame and crack the skin, leading to a chronic, eczema-like condition of its own.",
      "This is part of why the clinic weighs surgical and non-surgical treatment options against simply living with the condition indefinitely: prolonged, escalating self-management is not a neutral choice, and it has its own downsides worth knowing about before committing to it as a long-term strategy.",
    ],
  },
  {
    slug: "what-causes-excessive-sweating",
    title: "What Causes Excessive Sweating?",
    excerpt:
      "A range of health conditions and medications can trigger sweating, which is why the clinic distinguishes primary hyperhidrosis (no underlying cause) from secondary hyperhidrosis, which has one.",
    topic: "The science",
    sourceUrl: "https://www.perthsweatclinic.com.au/blog/what-causes-excessive-sweating/",
    body: [
      "Not all excessive sweating is the same condition, which is why the first step in any consultation is working out which kind you actually have. Clinically, sweating is split into two categories: primary hyperhidrosis, which has no identifiable underlying medical cause, and secondary hyperhidrosis, which is a symptom of something else.",
      "A wide range of health conditions and medications can trigger secondary sweating: fevers, cardiac events, obesity and an overactive thyroid (hyperthyroidism) among them, along with a number of medications that list sweating as a side effect. Identifying and treating the underlying cause is the right approach for secondary hyperhidrosis, and ruling it out is part of what a proper diagnosis involves.",
      "Primary hyperhidrosis is different: it typically begins in the early teenage years, often runs in families, and is not a symptom of anything else that needs to be found and treated separately. It is the overactive sympathetic nervous system itself, not an underlying illness, driving the sweat glands in the hands, underarms or face.",
      "Getting this distinction right at the consultation stage is what determines everything that follows: whether the right next step is investigating a possible underlying cause, or moving toward a targeted treatment like ETS or miraDry for primary hyperhidrosis.",
    ],
  },
  {
    slug: "facts-about-palmar-hyperhidrosis",
    title: "Facts About Palmar Hyperhidrosis",
    excerpt:
      "Affecting an estimated 1 to 3% of people worldwide, palmar hyperhidrosis usually appears in the teenage years and persists into adulthood, often with a genetic link.",
    topic: "The science",
    sourceUrl: "https://www.perthsweatclinic.com.au/blog/facts-about-palmar-hyperhidrosis/",
    body: [
      "Palmar hyperhidrosis, excessive sweating of the hands, affects an estimated 1 to 3% of people worldwide, though most never seek treatment for it, having assumed for years that it was simply something to live with.",
      "It typically first appears in the early teenage years and, without treatment, persists into adulthood. It often runs in families: a genetic link is common, and it is not unusual for a patient to be able to point to a parent or sibling with the same condition.",
      "Because it usually starts so young, palmar hyperhidrosis has an outsized effect on exactly the years when handshakes, exams, and first impressions matter most: job interviews, new relationships, physical work with tools or paper. Patients frequently describe having organised small parts of their life around it for so long that it stops feeling like a medical condition and starts feeling like a personality trait.",
      "It is not one. Palmar hyperhidrosis has a specific physiological cause, an overactive sympathetic nerve chain, and a specific surgical treatment, ETS, that addresses that cause directly rather than managing the symptom.",
    ],
  },
];

/**
 * All internal same-page anchors, everywhere on the site, are absolute
 * (`/#slug`) rather than bare (`#slug`). SiteNav and Footer render on every
 * route, not just the homepage where these sections actually live — a bare
 * hash on `/blog` just rewrites the current URL's fragment and goes
 * nowhere, since there's no matching id on that page to scroll to.
 */
export const navLinks = [
  { label: "The condition", href: "/#conditions" },
  { label: "Our team", href: "/#doctor" },
  { label: "Treatments", href: "/#treatments" },
  { label: "Your journey", href: "/#journey" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];
