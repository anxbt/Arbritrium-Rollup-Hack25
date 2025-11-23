import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Why do I need gas?",
    answer: "Gas is like fuel for blockchain transactions. Every time you move an NFT, the blockchain needs a little payment to process it. But don't worry—we handle all that for you automatically!",
  },
  {
    question: "What if I don't have gas on my L3 wallet?",
    answer: "That's the beauty of our service! If your wallet is missing gas, our relayer automatically tops it up and completes the bridge. You don't need to do anything.",
  },
  {
    question: "How long does the bridge take?",
    answer: "Usually just a few seconds! Our system fixes gas, bridges your NFT, and lands it on L2 in one smooth flow. You'll see real-time status updates along the way.",
  },
  {
    question: "Is my NFT safe during the bridge?",
    answer: "Absolutely. The bridge is handled by smart contracts and our secure relayer. Your NFT is locked on L3 until it safely arrives on L2—no in-between disappearing acts.",
  },
  {
    question: "Can I bridge multiple NFTs at once?",
    answer: "Right now, we focus on one NFT at a time to keep things simple and reliable. But we're working on batch bridging for the future!",
  },
  {
    question: "What chains do you support?",
    answer: "Currently, we bridge NFTs from Orbit L3 to Arbitrum L2. We're exploring more chains, but this combo is our sweet spot for now.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background pt-24 px-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Simple answers for curious humans
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border-border rounded-xl px-6 hover:border-primary/50 transition-colors"
            >
              <AccordionTrigger className="text-left font-heading font-semibold text-lg hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
