export interface Feedback {
  id: string;
  license_key: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
}
