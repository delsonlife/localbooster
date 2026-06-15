export interface License {
  id: string;
  license_key: string;
  company_name: string;
  company_email: string;
  google_review_url: string;
  primary_color: string;
  plan: "starter" | "pro" | "premium" | string;
  active: boolean;
  created_at: string;
}
