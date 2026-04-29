import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xofuejkiilnrwafekqro.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4KGp4_lp7Bql4uRo4iY1ew_DsPzLePB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);