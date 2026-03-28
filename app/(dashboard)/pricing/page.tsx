import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free Trial",
    description: "Get started with all features",
    price: "$0",
    period: "30 days",
    features: [
      "Unlimited symptom analyses",
      "Full AI-powered assessments",
      "Detailed health reports",
      "Analytics dashboard",
      "Email support",
    ],
    current: true,
    cta: "Current Plan",
  },
  {
    name: "Pro",
    description: "For individuals who want continuous health monitoring",
    price: "$9.99",
    period: "per month",
    features: [
      "Everything in Free Trial",
      "Priority AI processing",
      "Advanced analytics & insights",
      "Export reports as PDF",
      "Family sharing (up to 5)",
      "Priority email support",
    ],
    popular: true,
    cta: "Upgrade to Pro",
  },
  {
    name: "Enterprise",
    description: "For healthcare organizations and teams",
    price: "Custom",
    period: "contact us",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
      "HIPAA compliance",
    ],
    cta: "Contact Sales",
  },
]

export default function PricingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Choose the plan that works best for your health monitoring needs. All
          plans include our core AI-powered triage features.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative flex flex-col",
              plan.popular && "border-primary shadow-lg"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Star className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">/{plan.period}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "mt-6 w-full gap-2",
                  plan.current && "bg-muted text-muted-foreground hover:bg-muted"
                )}
                variant={plan.popular ? "default" : "outline"}
                disabled={plan.current}
              >
                {plan.popular && <Zap className="h-4 w-4" />}
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Can I cancel anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can cancel your subscription at any time. Your access
              will continue until the end of your billing period.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">What happens after my trial ends?</h3>
            <p className="text-sm text-muted-foreground">
              After your trial, you can choose to upgrade to Pro or continue
              with limited free features.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Is my health data secure?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, we use industry-standard encryption and never share your
              personal health information with third parties.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Do you offer refunds?</h3>
            <p className="text-sm text-muted-foreground">
              We offer a 30-day money-back guarantee on all paid plans if
              you&apos;re not satisfied.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="text-lg font-semibold">Need a custom solution?</h3>
            <p className="text-sm text-muted-foreground">
              Contact our team to discuss enterprise pricing and custom features
            </p>
          </div>
          <Button size="lg">Contact Sales</Button>
        </CardContent>
      </Card>
    </div>
  )
}
