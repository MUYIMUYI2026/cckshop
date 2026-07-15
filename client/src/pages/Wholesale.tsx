import { useState } from "react";
import { Package, TrendingDown, Headphones, Globe, CheckCircle, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BENEFITS = [
  {
    icon: TrendingDown,
    title: "Up to 40% Off Retail",
    desc: "Access exclusive wholesale pricing that maximizes your profit margins on every order.",
  },
  {
    icon: Package,
    title: "Low Minimum Orders",
    desc: "Start with as few as 5 units per SKU. No need for large upfront investments.",
  },
  {
    icon: Globe,
    title: "Worldwide Shipping",
    desc: "We ship to 50+ countries with reliable logistics partners and competitive rates.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Get a dedicated account manager to help with orders, returns, and product selection.",
  },
];

const TIERS = [
  {
    name: "Starter",
    minOrder: "$200",
    discount: "15% off",
    color: "border-gray-200",
    badge: "",
    features: ["Access to all categories", "Standard shipping rates", "Email support", "Basic product catalog"],
  },
  {
    name: "Business",
    minOrder: "$500",
    discount: "25% off",
    color: "border-primary",
    badge: "Most Popular",
    features: ["Everything in Starter", "Priority shipping", "Dedicated account manager", "Extended product catalog", "Net 30 payment terms"],
  },
  {
    name: "Enterprise",
    minOrder: "$2,000",
    discount: "40% off",
    color: "border-gray-200",
    badge: "",
    features: ["Everything in Business", "Custom pricing", "White-label options", "Exclusive product access", "Flexible payment terms"],
  },
];

export default function Wholesale() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    subject: "Wholesale Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application submitted! We'll contact you within 24 hours.");
    },
    onError: () => {
      toast.error("Failed to submit. Please try again or email us directly.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitMutation.mutate({ ...form, isWholesaleInquiry: true });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary mb-6">
            <Package className="w-3.5 h-3.5" />
            Wholesale Program
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            Grow Your Business<br />with <span className="text-primary">CCKShop</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join thousands of retailers and distributors who trust CCKShop for premium products at wholesale prices. Start your application today.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-10">Why Choose CCKShop Wholesale?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(b => (
              <div key={b.title} className="text-center p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-2">Wholesale Tiers</h2>
          <p className="text-center text-muted-foreground mb-10">Choose the tier that fits your business needs</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {TIERS.map(tier => (
              <div
                key={tier.name}
                className={`bg-white rounded-2xl border-2 ${tier.color} p-6 relative ${tier.badge ? "shadow-lg" : ""}`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground mb-1">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">Min. order: {tier.minOrder}</p>
                <div className="text-2xl font-black text-primary mb-5">{tier.discount}</div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.badge ? "default" : "outline"}
                  className="w-full"
                  onClick={() => document.getElementById("wholesale-form")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="wholesale-form" className="py-16 bg-white">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Apply for Wholesale Account</h2>
            <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="text-center py-12 bg-primary/5 rounded-2xl border border-primary/20">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Application Received!</h3>
              <p className="text-muted-foreground">
                Thank you for your interest. Our wholesale team will contact you at <strong>{form.email}</strong> within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-muted/30 rounded-2xl p-8 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="john@company.com"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  placeholder="Your Company LLC"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Tell Us About Your Business *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your business, what products you're interested in, estimated monthly order volume, etc."
                  rows={5}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 font-semibold"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Application"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
