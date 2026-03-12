import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DesignSystem = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-12 space-y-16 mt-20">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Design System</h1>
          <p className="text-muted-foreground text-lg">
            Roshan Training Institute - Official Component & Style Showcase
          </p>
        </div>

        {/* Colors */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold border-b pb-2">Brand Colors</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-4">Primary Brand Colors (From Logo)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <div className="h-32 bg-[#1D4ED8] rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle className="text-lg">Royal Data Blue</CardTitle>
                    <CardDescription>#1D4ED8 / hsl(var(--primary))</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Primary buttons, Links, Headings accents, Icons, Active states
                  </CardContent>
                </Card>
                <Card>
                  <div className="h-32 bg-[#0B1F3A] rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle className="text-lg">Deep Navy Blue</CardTitle>
                    <CardDescription>#0B1F3A</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Hero background base, Footer, Dark sections, Navbar, Dashboard sidebar
                  </CardContent>
                </Card>
                <Card>
                  <div className="h-32 bg-[#3B82F6] rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle className="text-lg">Electric Accent Blue</CardTitle>
                    <CardDescription>#3B82F6 / hsl(var(--accent))</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Hover states, Button glow, Gradients, Subtle highlights
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Secondary Brand Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <div className="h-32 bg-[#F97316] rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle className="text-lg">Vibrant Orange</CardTitle>
                    <CardDescription>#F97316 / hsl(var(--secondary))</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    CTA highlights, Status highlights, Accent icons, Important badges
                  </CardContent>
                </Card>
                <Card>
                  <div className="h-32 bg-[#FBBF24] rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle className="text-lg">Golden Amber</CardTitle>
                    <CardDescription>#FBBF24 / hsl(var(--golden))</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Gradient overlays, Success metrics highlights, Decorative accents
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Neutral System</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <div className="h-32 bg-[#F8FAFC] border-b rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle className="text-lg">Soft Background Gray</CardTitle>
                    <CardDescription>#F8FAFC / hsl(var(--background))</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <div className="h-32 bg-[#FFFFFF] border-b rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle className="text-lg">Card White</CardTitle>
                    <CardDescription>#FFFFFF / hsl(var(--card))</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <div className="h-32 bg-[#E2E8F0] border-b rounded-t-lg"></div>
                  <CardHeader>
                    <CardTitle className="text-lg">Border Gray</CardTitle>
                    <CardDescription>#E2E8F0 / hsl(var(--border))</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Gradients */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold border-b pb-2">Gradients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="h-40 hero-bg rounded-t-lg"></div>
              <CardHeader>
                <CardTitle>Hero Gradient</CardTitle>
                <CardDescription>class="hero-bg"</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                linear-gradient(135deg, #0B1F3A 0%, #1D4ED8 50%, #3B82F6 100%)
              </CardContent>
            </Card>
            <Card>
              <div className="h-40 cta-gradient rounded-t-lg"></div>
              <CardHeader>
                <CardTitle>CTA Gradient</CardTitle>
                <CardDescription>class="cta-gradient"</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                linear-gradient(90deg, #F97316 0%, #FBBF24 100%)
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold border-b pb-2">Typography</h2>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Space Grotesk (Display Font)</CardTitle>
                <CardDescription>Used for Headings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 font-display">
                <h1 className="text-5xl font-bold">Heading 1: Transform Your Career</h1>
                <h2 className="text-4xl font-semibold">Heading 2: Our Programs</h2>
                <h3 className="text-3xl font-medium">Heading 3: Data Analytics</h3>
                <h4 className="text-2xl">Heading 4: Course Overview</h4>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-body">Inter (Body Font)</CardTitle>
                <CardDescription>Used for regular text and paragraphs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 font-body">
                <p className="text-lg"><strong>Large Text:</strong> Roshan Training Institute offers cutting-edge courses designed to propel your career in technology.</p>
                <p className="text-base"><strong>Regular Text:</strong> Our curriculum is designed by industry experts with hands-on experience in real-world scenarios, ensuring you get practical knowledge.</p>
                <p className="text-sm text-muted-foreground"><strong>Small / Muted Text:</strong> © 2024 Roshan Training Institute. All rights reserved.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Components Showcase */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold border-b pb-2">Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button variant="default">Default / Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="hero">Hero CTA</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default DesignSystem;