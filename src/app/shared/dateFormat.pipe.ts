import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name:'formatDate'
})
export class FormatDatePipe implements PipeTransform{
    transform(value: Date): String {
        return "" + value.getDay() + "-" + value.getMonth() + "-" + value.getFullYear();
    }

}