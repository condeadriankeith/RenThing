import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Calculator,
  Info,
  TrendingUp
} from "lucide-react"

export default function ServiceFeesPage() {
  const feeStructure = [
    {
      userType: "Renters",
      fee: "5%",
      description: "Service fee on total booking cost",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      details: [
        "Calculated on rental cost only",
        "Excludes delivery fees and deposits",
        "Covers platform maintenance",
        "Includes customer support",
        "Payment processing included"
      ]
    },
    {
      userType: "Owners",
      fee: "3%",
      description: "Service fee on earnings",
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      details: [
        "Deducted from total earnings",
        "Lower rate for item providers",
        "Includes marketing exposure",
        "Platform tools and analytics",
        "Insurance claim support"
      ]
    }
  ]

  const feeCalculation = [
    {
      scenario: "₱1,000 rental",
      renterPays: "₱1,050",
      ownerReceives: "₱970",
      breakdown: {
        rentalCost: "₱1,000",
        renterFee: "₱50 (5%)",
        ownerFee: "₱30 (3%)",
        platformFee: "₱80 total"
      }
    },
    {
      scenario: "₱5,000 rental",
      renterPays: "₱5,250",
      ownerReceives: "₱4,850",
      breakdown: {
        rentalCost: "₱5,000",
        renterFee: "₱250 (5%)",
        ownerFee: "₱150 (3%)",
        platformFee: "₱400 total"
      }
    }
  ]

  const whatFeesInclude = [
    {
      category: "Platform Services",
      icon: TrendingUp,
      features: [
        "Website and mobile app development",
        "Server hosting and maintenance",
        "Search and discovery algorithms",
        "User interface improvements",
        "Platform security measures"
      ]
    },
    {
      category: "Payment Processing",
      icon: CreditCard,
      features: [
        "Secure payment processing",
        "Multiple payment methods",
        "Fraud protection",
        "Currency conversion",
        "Payment dispute handling"
      ]
    },
    {
      category: "Customer Support",
      icon: CheckCircle,
      features: [
        "24/7 customer service",
        "Dispute resolution",
        "Technical support",
        "Safety assistance",
        "Account management help"
      ]
    }
  ]

  const additionalFees = [
    {
      type: "Delivery Fee",
      amount: "Variable",
      description: "Set by owner, covers transportation costs"
    },
    {
      type: "Security Deposit",
      amount: "Refundable",
      description: "Held temporarily, returned after rental"
    },
    {
      type: "Late Return Fee",
      amount: "1x daily rate",
      description: "Charged for returns past agreed time"
    },
    {
      type: "Damage Fee",
      amount: "Actual cost",
      description: "Cost of repairs or replacement"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <DollarSign className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Service Fees</h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Transparent breakdown of all fees and charges on the RenThing platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Back Navigation */}
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help Center
              </Link>
            </Button>
          </div>

          {/* Fee Structure */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Service Fee Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feeStructure.map((user, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{user.userType}</CardTitle>
                        <CardDescription>{user.description}</CardDescription>
                      </div>
                      <Badge className={user.color} style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}>
                        {user.fee}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {user.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Fee Calculator Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-6 h-6 text-blue-600 mr-2" />
                Fee Calculation Examples
              </CardTitle>
              <CardDescription>
                See exactly how fees are calculated for different rental amounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {feeCalculation.map((example, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{example.scenario}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Renter Pays</div>
                        <div className="text-xl font-bold text-blue-600">{example.renterPays}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Rental Cost</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{example.breakdown.rentalCost}</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Owner Receives</div>
                        <div className="text-xl font-bold text-green-600">{example.ownerReceives}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>Renter fee: {example.breakdown.renterFee}</div>
                      <div>Platform total: {example.breakdown.platformFee}</div>
                      <div>Owner fee: {example.breakdown.ownerFee}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What Fees Include */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              What Your Service Fee Includes
            </h2>
            <div className="grid gap-6">
              {whatFeesInclude.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <IconComponent className="w-6 h-6 text-blue-600 mr-2" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {category.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Additional Fees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-6 h-6 text-blue-600 mr-2" />
                Additional Fees (Not Service Fees)
              </CardTitle>
              <CardDescription>
                Other charges that may apply but are separate from service fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {additionalFees.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{fee.type}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{fee.description}</p>
                    </div>
                    <Badge variant="outline">{fee.amount}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transparency Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Complete Transparency</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              All fees are clearly displayed before you confirm any booking. There are no hidden charges or surprise fees. 
              You'll see the exact breakdown of costs before making any payment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/browse">
                  Browse Items
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Questions About Fees?
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}