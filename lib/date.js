import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

export default function idDate(date, dateFormat = 'dd MMMM yyyy') {
  return format(new Date(date), dateFormat, { locale: idLocale });
}
