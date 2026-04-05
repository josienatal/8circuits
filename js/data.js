const CIRCUITS = [
  {
    num: 1, name: "Survival", keyword: "Safety", tier: "Terrestrial",
    color: "#c8a96e",
    description: "Your primal sense of safety in the world. Imprinted early in life through the quality of care you received. When activated in fear, you freeze, flee, or collapse. When healthy, you feel fundamentally safe and grounded.",
    stuck: "Chronic anxiety, hypervigilance, distrust of others, inability to relax even in safe environments.",
    practices: ["Nervous system regulation — cold/heat therapy, breathwork", "Somatic therapy or trauma-informed bodywork", "Build a consistent daily routine that signals safety", "Time in nature — slow, unhurried walks"],
    journalPrompts: [
      "When do I feel most safe in my life? When do I feel most unsafe?",
      "What did safety feel like in my childhood home?",
      "What would my life look like if I fully trusted the world?"
    ],
    question: "Right now, I feel...",
    options: [
      { text: "Anxious, unsafe, or like something bad is about to happen", score: 1 },
      { text: "On edge but functional — managing okay", score: 2 },
      { text: "Neutral and relatively stable", score: 3 },
      { text: "Grounded, relaxed, and fundamentally safe", score: 4 }
    ]
  },
  {
    num: 2, name: "Power", keyword: "Territory", tier: "Terrestrial",
    color: "#c8a96e",
    description: "Your relationship to power, dominance, and social rank. Do you feel capable and strong, or powerless and submissive? Imprinted through early experiences of control and authority.",
    stuck: "Compulsive dominance, chronic submission, passive aggression, rage, feeling constantly disrespected.",
    practices: ["Build one domain you master and own completely", "Healthy competition — martial arts, chess, debate", "Therapy focused on assertion and boundaries", "Leadership roles with genuine responsibility"],
    journalPrompts: [
      "Where in my life do I feel powerless? Where do I feel powerful?",
      "How do I respond when someone challenges or disrespects me?",
      "What does healthy power — not dominance — look like to me?"
    ],
    question: "In my life, I typically feel...",
    options: [
      { text: "Powerless, walked over, like I have no control", score: 1 },
      { text: "Sometimes capable, but often deferring unnecessarily", score: 2 },
      { text: "Reasonably confident in my own agency", score: 3 },
      { text: "Grounded in my power without needing to dominate", score: 4 }
    ]
  },
  {
    num: 3, name: "Intellect", keyword: "Language", tier: "Terrestrial",
    color: "#c8a96e",
    description: "Your capacity for language, reasoning, and building mental models. Shaped by education and early messages about your intelligence. Determines how you process and communicate reality.",
    stuck: "Intellectual arrogance, paralysis by analysis, imposter syndrome, inability to trust intuition.",
    practices: ["Learn something genuinely hard — a language, instrument, skill", "Write daily, even just 10 minutes", "Read philosophy, systems thinking, or science", "Teach what you know to others"],
    journalPrompts: [
      "What beliefs do I hold about my own intelligence?",
      "When do I feel most mentally alive and engaged?",
      "What's a hard idea I've been avoiding thinking about?"
    ],
    question: "When I face problems, I...",
    options: [
      { text: "Feel confused or like I'm not smart enough", score: 1 },
      { text: "Can reason through things but often doubt my conclusions", score: 2 },
      { text: "Think clearly and trust my reasoning process", score: 3 },
      { text: "Enjoy complexity — problem-solving feels energizing", score: 4 }
    ]
  },
  {
    num: 4, name: "Social", keyword: "Belonging", tier: "Terrestrial",
    color: "#c8a96e",
    description: "Your relationship to social norms, morality, sexuality, and group identity. Defines how you fit into — or rebel against — the tribe. Most humans live primarily in this circuit throughout their lives.",
    stuck: "Desperate need for approval, moral rigidity, tribalism, sexual shame, conformity over authenticity.",
    practices: ["Examine which values are truly yours vs inherited", "Spend time with people outside your usual social group", "Explore your relationship to sexuality openly", "Practice saying no without excessive explanation"],
    journalPrompts: [
      "Which of my values did I consciously choose vs inherit from culture?",
      "Where in my life am I performing a role rather than being myself?",
      "What would I do if I didn't care what anyone thought?"
    ],
    question: "My sense of who I am is...",
    options: [
      { text: "Entirely dependent on what others think of me", score: 1 },
      { text: "Mostly shaped by my social roles and others' expectations", score: 2 },
      { text: "Mostly my own, though I care what close people think", score: 3 },
      { text: "Genuinely mine — independent of roles or approval", score: 4 }
    ]
  },
  {
    num: 5, name: "Body", keyword: "Sensation", tier: "Cosmic",
    color: "#e8c87a",
    description: "Awakening to the intelligence of the body itself. Pleasure, ecstasy, and expanded sensory awareness as gateways to higher knowledge. This circuit is only accessible when the survival circuits are calm.",
    stuck: "Disconnection from the body, numbing through screens or substances, inability to feel genuine pleasure.",
    practices: ["Yoga, tantra, or somatic movement practices", "Extended breathwork — holotropic, Wim Hof", "Conscious sexuality and embodiment work", "Sensory presence: eating, touch, music — fully felt"],
    journalPrompts: [
      "When do I feel most alive in my body?",
      "What does pleasure mean to me — and do I allow myself to feel it?",
      "How does my body signal wisdom or discomfort to me?"
    ],
    question: "My relationship with my body is...",
    options: [
      { text: "Disconnected — I live mostly in my head", score: 1 },
      { text: "Functional but not particularly alive or pleasurable", score: 2 },
      { text: "Generally positive — I enjoy physical experience", score: 3 },
      { text: "A source of real wisdom, pleasure, and aliveness", score: 4 }
    ]
  },
  {
    num: 6, name: "Mind", keyword: "Metaprogramming", tier: "Cosmic",
    color: "#e8c87a",
    description: "The mind observing itself observing. You realize you can reprogram your own belief systems, emotional patterns, and perceptual filters. This is the circuit of genuine self-transformation.",
    stuck: "Infinite self-analysis without action, spiritual bypassing, using insight as avoidance.",
    practices: ["Meditation focused on the observer quality of awareness", "Psychotherapy that surfaces unconscious patterns", "Journaling that questions your core beliefs", "Study of cognitive science, psychology, or philosophy of mind"],
    journalPrompts: [
      "What belief about myself has most limited my life?",
      "If I could reprogram one thing about how I see myself, what would it be?",
      "What patterns do I keep repeating despite knowing better?"
    ],
    question: "My relationship to my own beliefs is...",
    options: [
      { text: "I mostly accept my beliefs as simply true", score: 1 },
      { text: "I know beliefs can be wrong, but rarely examine mine", score: 2 },
      { text: "I regularly question my assumptions and update my views", score: 3 },
      { text: "I see my beliefs as programs I can consciously rewrite", score: 4 }
    ]
  },
  {
    num: 7, name: "Ancestral", keyword: "Collective", tier: "Cosmic",
    color: "#e8c87a",
    description: "Connection to something larger than the individual — collective consciousness, ancestral memory, the intelligence embedded in evolutionary history. Jung called this the collective unconscious.",
    stuck: "Spiritual inflation, grandiosity, losing individual identity in abstract universalism.",
    practices: ["Deep meditation or contemplative prayer", "Ancestral lineage work and family constellation therapy", "Study of mythology, Jungian psychology, or perennial philosophy", "Plant medicine work in a safe, structured context"],
    journalPrompts: [
      "What from my ancestors or lineage am I still carrying?",
      "When have I felt connected to something larger than myself?",
      "What does my life mean in the context of all human history?"
    ],
    question: "I experience connection to something larger than myself...",
    options: [
      { text: "Rarely — I focus on the practical and personal", score: 1 },
      { text: "Occasionally, usually in nature or music", score: 2 },
      { text: "Regularly — I feel connected to history or humanity", score: 3 },
      { text: "Often — I feel part of a living, intelligent whole", score: 4 }
    ]
  },
  {
    num: 8, name: "Quantum", keyword: "Transcendence", tier: "Cosmic",
    color: "#e8c87a",
    description: "The dissolution of the boundary between self and universe. Mystics call it samadhi, satori, nirvana. Not a permanent state but an access point — glimpsed in peak experiences, then integrated.",
    stuck: "Chasing peak states as escape, inability to integrate transcendent experiences into daily life.",
    practices: ["Long-term dedicated meditation practice — years, not weeks", "Deep immersion in non-dual philosophical traditions", "Integration work after any peak or transcendent experience", "Service — grounding the infinite in the finite through action"],
    journalPrompts: [
      "Have I ever felt no separation between myself and everything else?",
      "What's the difference between my 'self' and pure awareness?",
      "What would it mean to live from a place of expanded awareness?"
    ],
    question: "The boundary between 'me' and everything else...",
    options: [
      { text: "Has never dissolved — I always feel like a separate self", score: 1 },
      { text: "Has occasionally softened, maybe in nature or music", score: 2 },
      { text: "Has meaningfully dissolved in meditation, grief, or awe", score: 3 },
      { text: "Has completely dissolved — I've touched something beyond self", score: 4 }
    ]
  }
];

const APP_STATE = {
  scores: JSON.parse(localStorage.getItem('circuit_scores') || 'null'),
  journals: JSON.parse(localStorage.getItem('circuit_journals') || '{}'),
  lastAssessed: localStorage.getItem('circuit_last_assessed') || null,
  currentPage: 'home',

  checkins: JSON.parse(localStorage.getItem('circuit_checkins') || '[]'),
  savedPlan: JSON.parse(localStorage.getItem('circuit_saved_plan') || 'null'),

  save() {
    localStorage.setItem('circuit_scores', JSON.stringify(this.scores));
    localStorage.setItem('circuit_journals', JSON.stringify(this.journals));
    localStorage.setItem('circuit_last_assessed', this.lastAssessed);
    localStorage.setItem('circuit_checkins', JSON.stringify(this.checkins));
    localStorage.setItem('circuit_saved_plan', JSON.stringify(this.savedPlan));
  },

  addCheckin(scores, note) {
    this.checkins.push({
      date: new Date().toISOString(),
      scores,
      note: note || ''
    });
    this.save();
  },

  savePlan(plan, circuitIdx) {
    this.savedPlan = { plan, circuitIdx, savedAt: new Date().toISOString() };
    this.save();
  },

  getDominantCircuit() {
    if (!this.scores) return null;
    const min = Math.min(...this.scores);
    return this.scores.indexOf(min);
  },

  getStrongestCircuit() {
    if (!this.scores) return null;
    const max = Math.max(...this.scores);
    return this.scores.indexOf(max);
  },

  getTodayPrompts() {
    const today = new Date().toDateString();
    const idx = Math.abs(today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 8;
    return { circuitIdx: idx, prompts: CIRCUITS[idx].journalPrompts };
  }
};
