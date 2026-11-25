"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { expertiseVisual } from "@/components/homepage/expertiseVisuals";
import SectionHeading from "@/components/ui/SectionHeading";
import TechLogo from "@/components/tech/TechLogo";

const CATALOG = [
  {
    title: "Digital Marketing",
    tagline: "Growth through intelligent marketing",
    description:
      "Data-driven campaigns, search optimization and creative strategies designed to amplify your brand, generate qualified leads and accelerate revenue.",
    features: [
      "SEO & content strategy",
      "Paid advertising",
      "Social media marketing",
      "Analytics & reporting",
    ],
    stack: [
      { name: "Google Ads", role: "Search & display", logo: "/tech/googleads.svg" },
      { name: "Meta Ads", role: "Social campaigns", logo: "/tech/meta.svg" },
      { name: "LinkedIn Ads", role: "B2B campaigns", logo: "/tech/linkedin.svg" },
      { name: "TikTok Ads", role: "Short-form video", logo: "/tech/tiktok.svg" },
      { name: "Google Analytics", role: "Web analytics", logo: "/tech/googleanalytics.svg" },
      { name: "Google Tag Manager", role: "Tracking", logo: "/tech/googletagmanager.svg" },
      { name: "Google Search Console", role: "Search health", logo: "/tech/googlesearchconsole.svg" },
      { name: "Looker Studio", role: "Reporting", logo: "/tech/looker.svg" },
      { name: "Google BigQuery", role: "Data warehouse", logo: "/tech/googlebigquery.svg" },
      { name: "Mixpanel", role: "Product analytics", logo: "/tech/mixpanel.svg" },
      { name: "Hotjar", role: "Behavior insights", logo: "/tech/hotjar.svg" },
      { name: "Semrush", role: "SEO research", logo: "/tech/semrush.svg" },
      { name: "HubSpot", role: "Marketing automation", logo: "/tech/hubspot.svg" },
      { name: "Salesforce", role: "CRM", logo: "/tech/salesforce.svg" },
      { name: "Mailchimp", role: "Email marketing", logo: "/tech/mailchimp.svg" },
      { name: "Zapier", role: "Workflow automation", logo: "/tech/zapier.svg" },
    ],
  },
  {
    title: "AI Powered Solutions",
    tagline: "Intelligence built into the product",
    description:
      "Predictive analytics, language tools, and automation that help teams decide faster and ship smarter workflows.",
    features: [
      "AI integrations",
      "Workflow automation",
      "Predictive insights",
      "Model-backed features",
    ],
    stack: [
      { name: "OpenAI", role: "LLM platform", logo: "/tech/openai.svg" },
      { name: "Anthropic", role: "LLM platform", logo: "/tech/anthropic.svg" },
      { name: "Google Gemini", role: "Multimodal AI", logo: "/tech/googlegemini.svg" },
      { name: "Hugging Face", role: "Model hub", logo: "/tech/huggingface.svg" },
      { name: "LangChain", role: "LLM orchestration", logo: "/tech/langchain.svg" },
      { name: "PyTorch", role: "Deep learning", logo: "/tech/pytorch.svg" },
      { name: "TensorFlow", role: "Model training", logo: "/tech/tensorflow.svg" },
      { name: "scikit-learn", role: "Machine learning", logo: "/tech/scikitlearn.svg" },
      { name: "Keras", role: "Neural networks", logo: "/tech/keras.svg" },
      { name: "OpenCV", role: "Computer vision", logo: "/tech/opencv.svg" },
      { name: "ONNX", role: "Model portability", logo: "/tech/onnx.svg" },
      { name: "MLflow", role: "MLOps", logo: "/tech/mlflow.svg" },
      { name: "Weights & Biases", role: "Experiment tracking", logo: "/tech/weightsandbiases.svg" },
      { name: "Apache Airflow", role: "Data pipelines", logo: "/tech/apacheairflow.svg" },
      { name: "Apache Spark", role: "Big data", logo: "/tech/apachespark.svg" },
      { name: "NVIDIA CUDA", role: "GPU compute", logo: "/tech/nvidia.svg" },
    ],
  },
  {
    title: "App Development",
    tagline: "Mobile products people keep using",
    description:
      "Build intuitive mobile experiences for iOS and Android, designed for speed, usability and growth.",
    features: [
      "Cross-platform apps",
      "Native experiences",
      "Offline-ready flows",
      "Store-ready releases",
    ],
    stack: [
      { name: "Flutter", role: "Cross-platform", logo: "/tech/flutter.svg" },
      { name: "React Native", role: "Cross-platform", logo: "/tech/react.svg" },
      { name: "Expo", role: "Mobile tooling", logo: "/tech/expo.svg" },
      { name: "Jetpack Compose", role: "Android UI", logo: "/tech/jetpackcompose.svg" },
      { name: "SwiftUI", role: "iOS UI", logo: "/tech/swift.svg" },
      { name: "Xcode", role: "iOS builds", logo: "/tech/xcode.svg" },
      { name: "Android Studio", role: "Android builds", logo: "/tech/androidstudio.svg" },
      { name: "Firebase", role: "Mobile backend", logo: "/tech/firebase.svg" },
      { name: "Supabase", role: "Realtime backend", logo: "/tech/supabase.svg" },
      { name: "GraphQL", role: "API layer", logo: "/tech/graphql.svg" },
      { name: "Apollo", role: "Data client", logo: "/tech/apollographql.svg" },
      { name: "Stripe", role: "In-app payments", logo: "/tech/stripe.svg" },
      { name: "Sentry", role: "Crash reporting", logo: "/tech/sentry.svg" },
      { name: "Fastlane", role: "Release automation", logo: "/tech/fastlane.svg" },
      { name: "Codemagic", role: "Mobile CI/CD", logo: "/tech/codemagic.svg" },
      { name: "Google Play", role: "Distribution", logo: "/tech/googleplay.svg" },
      { name: "App Store", role: "Distribution", logo: "/tech/appstore.svg" },
    ],
  },
  {
    title: "UI/UX Design",
    tagline: "Interfaces that feel effortless",
    description:
      "Create elegant, human-centered digital experiences that make complex products feel simple.",
    features: ["Design systems", "Prototyping", "User research", "Accessible UI"],
    stack: [
      { name: "Figma", role: "Interface design", logo: "/tech/figma.svg" },
      { name: "Framer", role: "Interactive prototypes", logo: "/tech/framer.svg" },
      { name: "Sketch", role: "Visual design", logo: "/tech/sketch.svg" },
      { name: "Miro", role: "Workshops & flows", logo: "/tech/miro.svg" },
      { name: "Storybook", role: "Component library", logo: "/tech/storybook.svg" },
      { name: "Tailwind CSS", role: "Design tokens", logo: "/tech/tailwindcss.svg" },
      { name: "shadcn/ui", role: "UI primitives", logo: "/tech/shadcnui.svg" },
      { name: "Radix UI", role: "Accessible components", logo: "/tech/radixui.svg" },
      { name: "Material UI", role: "Component system", logo: "/tech/mui.svg" },
      { name: "Chakra UI", role: "Component system", logo: "/tech/chakraui.svg" },
      { name: "GSAP", role: "Motion design", logo: "/tech/greensock.svg" },
      { name: "Rive", role: "Interactive animation", logo: "/tech/rive.svg" },
      { name: "Three.js", role: "3D experiences", logo: "/tech/threedotjs.svg" },
      { name: "Blender", role: "3D assets", logo: "/tech/blender.svg" },
      { name: "Webflow", role: "Visual development", logo: "/tech/webflow.svg" },
      { name: "Hotjar", role: "Usability insights", logo: "/tech/hotjar.svg" },
    ],
  },
  {
    title: "Web Development",
    tagline: "Fast sites built to grow",
    description:
      "Build fast, secure and scalable websites and applications tailored to your business goals.",
    features: [
      "High performance",
      "Responsive design",
      "Scalable architecture",
      "Search-ready pages",
    ],
    stack: [
      { name: "Next.js", role: "React framework", logo: "/tech/nextdotjs.svg" },
      { name: "React", role: "Interfaces", logo: "/tech/react.svg" },
      { name: "Nuxt", role: "Vue framework", logo: "/tech/nuxtdotjs.svg" },
      { name: "Django", role: "Backend framework", logo: "/tech/django.svg" },
      { name: "Node.js", role: "Runtime", logo: "/tech/nodedotjs.svg" },
      { name: "NestJS", role: "API framework", logo: "/tech/nestjs.svg" },
      { name: "GraphQL", role: "API layer", logo: "/tech/graphql.svg" },
      { name: "PostgreSQL", role: "Relational data", logo: "/tech/postgresql.svg" },
      { name: "Redis", role: "Caching", logo: "/tech/redis.svg" },
      { name: "Elasticsearch", role: "Search", logo: "/tech/elasticsearch.svg" },
      { name: "Apache Kafka", role: "Event streaming", logo: "/tech/apachekafka.svg" },
      { name: "RabbitMQ", role: "Message queues", logo: "/tech/rabbitmq.svg" },
      { name: "Prisma", role: "ORM", logo: "/tech/prisma.svg" },
      { name: "Docker", role: "Containers", logo: "/tech/docker.svg" },
      { name: "Kubernetes", role: "Orchestration", logo: "/tech/kubernetes.svg" },
      { name: "Cloudflare", role: "Edge network", logo: "/tech/cloudflare.svg" },
      { name: "Vercel", role: "Deployment", logo: "/tech/vercel.svg" },
      { name: "AWS", role: "Cloud", logo: "/tech/amazonwebservices.svg" },
    ],
  },
  {
    title: "Cyber Security",
    tagline: "Defense built into the product",
    description:
      "Protect your digital assets with security-focused architecture, assessments and proactive defense.",
    features: ["Security audits", "Data protection", "Threat prevention", "Secure architecture"],
    stack: [
      { name: "Kali Linux", role: "Penetration testing", logo: "/tech/kalilinux.svg" },
      { name: "Burp Suite", role: "Web app testing", logo: "/tech/burpsuite.svg" },
      { name: "Metasploit", role: "Exploit validation", logo: "/tech/metasploit.svg" },
      { name: "Wireshark", role: "Traffic analysis", logo: "/tech/wireshark.svg" },
      { name: "OWASP", role: "Security standards", logo: "/tech/owasp.svg" },
      { name: "Snyk", role: "Dependency scanning", logo: "/tech/snyk.svg" },
      { name: "SonarQube", role: "Code analysis", logo: "/tech/sonarqube.svg" },
      { name: "Dependabot", role: "Patch automation", logo: "/tech/dependabot.svg" },
      { name: "HashiCorp Vault", role: "Secrets management", logo: "/tech/vault.svg" },
      { name: "Okta", role: "Identity", logo: "/tech/okta.svg" },
      { name: "Auth0", role: "Authentication", logo: "/tech/auth0.svg" },
      { name: "Keycloak", role: "Access management", logo: "/tech/keycloak.svg" },
      { name: "Splunk", role: "SIEM", logo: "/tech/splunk.svg" },
      { name: "Elastic Security", role: "Threat detection", logo: "/tech/elastic.svg" },
      { name: "Cloudflare", role: "WAF & DDoS", logo: "/tech/cloudflare.svg" },
      { name: "WireGuard", role: "Secure networking", logo: "/tech/wireguard.svg" },
      { name: "Terraform", role: "Hardened infrastructure", logo: "/tech/terraform.svg" },
      { name: "Prometheus", role: "Monitoring", logo: "/tech/prometheus.svg" },
    ],
  },
];

function resolveServices(items) {
  const source = items?.length ? items : CATALOG;
  const resolved = source.map((item, index) => {
    const title = item.title || CATALOG[index % CATALOG.length].title;
    const known =
      CATALOG.find((entry) => entry.title.toLowerCase() === String(title).trim().toLowerCase()) ||
      CATALOG[index % CATALOG.length];
    return {
      ...known,
      title,
      description: item.description || known.description,
      stack: Array.isArray(item.stack) ? item.stack : known.stack,
      art: CATALOG.indexOf(known),
    };
  });
  return resolved.sort((a, b) => a.art - b.art);
}

export default function ServiceOrbit({
  items,
  eyebrow = "Services",
  title = "Our",
  highlight = "Expertise",
  subtitle = "A full spectrum of digital capabilities — combined under one roof to take your product from idea to impact.",
}) {
  const services = useMemo(() => resolveServices(items), [items]);
  const [selected, setSelected] = useState(0);
  const index = services.length ? Math.min(selected, services.length - 1) : 0;
  const service = services[index];
  const count = services.length;

  return (
    <div className="expertise-layout">
      <div className="expertise-lead">
        <div className="orbit-stage">
          <svg className="orbit-paths" viewBox="0 0 100 100" aria-hidden>
            <circle className="orbit-path" cx="50" cy="50" r="34" />
            <circle className="orbit-path orbit-path--lime" cx="50" cy="50" r="34" />
            <circle className="orbit-path orbit-path--soft" cx="50" cy="50" r="27" />
          </svg>

          {service && (
            <div className="orbit-hub">
              {(() => {
                const Icon = expertiseVisual(service);
                return <Icon size={22} aria-hidden />;
              })()}
              <strong>{service.title}</strong>
            </div>
          )}

          <div className="orbit-nodes" role="group" aria-label="Service categories">
            {services.map((item, itemIndex) => {
              const angle = (-90 + itemIndex * (360 / count)) * (Math.PI / 180);
              const active = itemIndex === index;
              const Icon = expertiseVisual(item);
              const node = {
                left: `${50 + Math.cos(angle) * 34}%`,
                top: `${50 + Math.sin(angle) * 34}%`,
              };
              const label = {
                left: `${50 + Math.cos(angle) * 49}%`,
                top: `${50 + Math.sin(angle) * 49}%`,
              };
              return (
                <div key={item.title}>
                  <button
                    type="button"
                    aria-pressed={active}
                    className={`orbit-node${active ? " is-active" : ""}`}
                    style={node}
                    onClick={() => setSelected(itemIndex)}
                  >
                    <Icon size={18} aria-hidden />
                    <span className="sr-only">{item.title}</span>
                  </button>
                  <span className={`orbit-label${active ? " is-active" : ""}`} style={label}>
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="orbit-meta">
          <span>Select a service to explore</span>
          <b>
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </b>
        </div>

        {service && (
          <article className="expertise-panel expertise-panel--service" aria-live="polite">
            <p className="expertise-kicker">Service / {String(index + 1).padStart(2, "0")}</p>
            <h3 className="expertise-name">{service.title}</h3>
            <p className="expertise-tagline">{service.tagline}</p>
            <p className="expertise-copy">{service.description}</p>
            <ul className="expertise-caps">
              {service.features.slice(0, 4).map((feature) => (
                <li key={feature}>
                  <Check size={16} aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>

      <div className="expertise-panels">
        <div className="expertise-heading">
          <SectionHeading
            align="left"
            eyebrow={eyebrow}
            title={
              <>
                {title} <span className="text-gradient">{highlight}.</span>
              </>
            }
            subtitle={subtitle}
          />
        </div>

        {service?.stack.length > 0 && (
          <article className="expertise-panel" aria-live="polite">
            <p className="expertise-kicker expertise-kicker--cyan">The technology stack</p>
            <h3 className="expertise-name expertise-name--sm">Technologies & Frameworks</h3>
            <p className="expertise-copy">Modern tools powering reliable digital solutions.</p>
            <ul className="expertise-tech-grid">
              {service.stack.map((tool) => (
                <li key={tool.name} className="expertise-tech">
                  <span className="expertise-logo">
                    <TechLogo name={tool.name} logo={tool.logo} className="h-full w-full" />
                  </span>
                  <strong>{tool.name}</strong>
                  {tool.role && <span>{tool.role}</span>}
                </li>
              ))}
            </ul>
            <p className="expertise-foot">
              <span aria-hidden />
              Built with industry-leading technologies
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
