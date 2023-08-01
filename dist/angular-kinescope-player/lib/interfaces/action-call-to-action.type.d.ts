export declare type ActionCallToAction = {
    id: string;
    type: 'cta';
    title: string;
    description?: string;
    skipable?: boolean;
    buttonStyle?: Record<string, string | number>;
    trigger: {
        percentages: number[];
        timePoints: number[];
        pause: boolean;
    };
};
