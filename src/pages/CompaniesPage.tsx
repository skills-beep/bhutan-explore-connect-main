import { companies } from "@/data/packages";
import { motion } from "framer-motion";
import { Star, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const CompaniesPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-24 bg-background">
      <div className="max-w-[980px] mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-8 mb-12 text-center">
          <h1 className="apple-headline text-4xl md:text-6xl text-foreground mb-3">Tour Companies</h1>
          <p className="text-muted-foreground text-lg font-light apple-body">Licensed Bhutanese operators you can trust.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {companies.map((company, i) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-2xl border border-border p-6 hover:shadow-card transition-all duration-500"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                  <span className="text-lg font-semibold text-foreground">{company.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">{company.tagline}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground mb-5">
                <div>
                  <span className="font-medium text-foreground">Email:</span> {company.email}
                </div>
                {company.whatsapp && (
                  <div>
                    <span className="font-medium text-foreground">WhatsApp:</span> {company.whatsapp}
                  </div>
                )}
                {company.phone && (
                  <div>
                    <span className="font-medium text-foreground">Phone:</span> {company.phone}
                  </div>
                )}
                {company.altPhone && (
                  <div>
                    <span className="font-medium text-foreground">Alt. Phone:</span> {company.altPhone}
                  </div>
                )}
                {company.licenseNo && (
                  <div>
                    <span className="font-medium text-foreground">License No.:</span> {company.licenseNo}
                  </div>
                )}
                {company.yearLicensed && (
                  <div>
                    <span className="font-medium text-foreground">Year Licensed:</span> {company.yearLicensed}
                  </div>
                )}
                {company.location && (
                  <div>
                    <span className="font-medium text-foreground">Location:</span> {company.location}
                  </div>
                )}
                <div>
                  <span className="font-medium text-foreground">Website:</span> <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">{company.website}</a>
                </div>
                <div>
                  <span className="font-medium text-foreground">Source:</span> {company.source}
                </div>
                {company.note && (
                  <div className="text-xs text-muted-foreground/90 italic">{company.note}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
