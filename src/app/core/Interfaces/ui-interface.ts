export const FormFieldType = {
    text : 'text',
    number : 'number',
    select : 'select',
    file : 'file',
    hidden : 'hidden',
    date : 'date',
    textarea : 'textarea',
    }

interface FormTitle {
        [key: string]: string;
}

interface ItemExternalRequestOptions {
    name?: string;
    url?: string;
    requestOutputPath?: string;
}

interface FormItem {
    fields?: FormField[];
}

class FormField {
    name: string="";
    label: FormTitle = { en: '', fr: '' };
    title?: FormTitle = { en: '', fr: '' };
    subtitle?: FormTitle = { en: '', fr: '' };
    type?: string = FormFieldType.text;
    values?: ItemValue[] = [];
    list_values?: any[] = [];
    list_values_keys?: any[] = [];
    readOnly ? = false;
    required ? = false;
    item?: FormItem;
    requestOptions?: ItemExternalRequestOptions;
    
    }

    interface FormStep {
        title: FormTitle;
        rows: FormItem[];
    }

  export interface ServiceForm {
        id: string;
        steps: FormStep[];
    }

export class ItemValue {
    label: FormTitle = { en: '', fr: '' };
    value: any;
}

