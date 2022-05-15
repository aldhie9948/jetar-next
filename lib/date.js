import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

export default function idDate(date, dateFormat = 'dd MMMM yyyy') {
  // dd MMMM yyyy "01 Oktober 2022"
  // MM "01, 02, 03"
  // MMM "Jan, Feb, Mar"
  // M "1, 2, 3"
  // HH "01, 02 ... 23"
  // mm "01, 02, ... 59"
  // ss "01, 02, ... 59"
  return format(new Date(date), dateFormat, { locale: idLocale });
}
