import { Link } from "wouter";
import { Shield, Globe, Heart, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "2018", label: "Founded" },
  { value: "10,000+", label: "Products" },
  { value: "50+", label: "Countries" },
  { value: "5,000+", label: "Customers" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Authenticity",
    desc: "Every product we carry is 100% authentic, sourced directly from authorized manufacturers and distributors.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "We serve customers in over 50 countries, delivering premium products to doorsteps worldwide.",
  },
  {
    icon: Heart,
    title: "Customer First",
    desc: "Your satisfaction is our priority. We offer hassle-free returns and dedicated customer support.",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    desc: "Quick processing and reliable logistics ensure your orders arrive on time, every time.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container text-center max-w-3xl">
          <h1 className="text-4xl lg:text-5xl font-black mb-6">
            About <span className="text-primary">CCKShop</span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            We're a global marketplace dedicated to connecting buyers with premium beauty, skincare, electronics, and daily essentials at unbeatable prices — for both retail shoppers and wholesale buyers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
            {STATS.map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  CCKShop was founded in 2018 with a simple mission: make premium products accessible to everyone, whether you're a consumer looking for the best deals or a business owner seeking reliable wholesale supply.
                </p>
                <p>
                  Based in Egg Harbor Township, New Jersey, we've grown from a small operation to a trusted global marketplace serving thousands of customers across 50+ countries. Our team is passionate about quality, authenticity, and exceptional service.
                </p>
                <p>
                  Today, CCKShop carries over 10,000 products across beauty, skincare, electronics, and daily essentials — all sourced from trusted brands and verified suppliers.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop"
                alt="Skincare products"
                className="rounded-2xl aspect-square object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop"
                alt="Beauty products"
                className="rounded-2xl aspect-square object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-10">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Shop?</h2>
          <p className="text-muted-foreground mb-8">
            Browse our extensive catalog of premium products or apply for a wholesale account today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <Button size="lg" className="gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/wholesale">
              <Button size="lg" variant="outline" className="gap-2">
                Wholesale Inquiry
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
