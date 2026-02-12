import { Users, Target, Heart, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building strong relationships and fostering a supportive community.',
    },
    {
      icon: Target,
      title: 'Goal Oriented',
      description: 'Every decision we make is driven by clear objectives and measurable outcomes.',
    },
    {
      icon: Heart,
      title: 'Passion Driven',
      description: 'We love what we do and it shows in the quality of our work.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we create and deliver.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              About <span className="text-primary">Our Story</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              We're on a mission to create meaningful digital experiences that
              make a difference in people's lives.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Mission
                </h2>
                <p className="text-muted-foreground mb-4">
                  We believe that technology should empower people, not
                  complicate their lives. That's why we're dedicated to creating
                  solutions that are both powerful and intuitive.
                </p>
                <p className="text-muted-foreground">
                  Our team is passionate about pushing the boundaries of what's
                  possible while maintaining a focus on user experience and
                  accessibility.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl font-bold text-primary mb-2">5+</div>
                    <div className="text-lg text-muted-foreground">Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do and shape the way we
              work together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're a diverse group of designers, developers, and strategists
              united by our passion for creating exceptional digital experiences.
            </p>
            <Card className="border-border/50">
              <CardContent className="p-8">
                <p className="text-muted-foreground italic">
                  "Our strength lies in our collaborative approach and shared
                  commitment to excellence. Together, we turn ideas into reality."
                </p>
                <p className="mt-4 font-semibold">— The Team</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
