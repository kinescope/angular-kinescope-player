export var KinescopePlayerEvent;
(function (KinescopePlayerEvent) {
    KinescopePlayerEvent[KinescopePlayerEvent["Ready"] = 0] = "Ready";
    KinescopePlayerEvent[KinescopePlayerEvent["QualityChanged"] = 1] = "QualityChanged";
    KinescopePlayerEvent[KinescopePlayerEvent["AutoQualityChanged"] = 2] = "AutoQualityChanged";
    KinescopePlayerEvent[KinescopePlayerEvent["SeekChapter"] = 3] = "SeekChapter";
    KinescopePlayerEvent[KinescopePlayerEvent["SizeChanged"] = 4] = "SizeChanged";
    KinescopePlayerEvent[KinescopePlayerEvent["Play"] = 5] = "Play";
    KinescopePlayerEvent[KinescopePlayerEvent["Playing"] = 6] = "Playing";
    KinescopePlayerEvent[KinescopePlayerEvent["Waiting"] = 7] = "Waiting";
    KinescopePlayerEvent[KinescopePlayerEvent["Pause"] = 8] = "Pause";
    KinescopePlayerEvent[KinescopePlayerEvent["Ended"] = 9] = "Ended";
    KinescopePlayerEvent[KinescopePlayerEvent["TimeUpdate"] = 10] = "TimeUpdate";
    KinescopePlayerEvent[KinescopePlayerEvent["Progress"] = 11] = "Progress";
    KinescopePlayerEvent[KinescopePlayerEvent["DurationChange"] = 12] = "DurationChange";
    KinescopePlayerEvent[KinescopePlayerEvent["VolumeChange"] = 13] = "VolumeChange";
    KinescopePlayerEvent[KinescopePlayerEvent["PlaybackRateChange"] = 14] = "PlaybackRateChange";
    KinescopePlayerEvent[KinescopePlayerEvent["Seeking"] = 15] = "Seeking";
    KinescopePlayerEvent[KinescopePlayerEvent["FullscreenChange"] = 16] = "FullscreenChange";
    KinescopePlayerEvent[KinescopePlayerEvent["CallAction"] = 17] = "CallAction";
    KinescopePlayerEvent[KinescopePlayerEvent["CallBookmark"] = 18] = "CallBookmark";
    KinescopePlayerEvent[KinescopePlayerEvent["Error"] = 19] = "Error";
    KinescopePlayerEvent[KinescopePlayerEvent["Destroy"] = 20] = "Destroy";
})(KinescopePlayerEvent || (KinescopePlayerEvent = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNjb3BlLXBsYXllci1ldmVudC5lbnVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1raW5lc2NvcGUtcGxheWVyL3NyYy9saWIvY29uc3RhbnRzL2tpbmVzY29wZS1wbGF5ZXItZXZlbnQuZW51bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQU4sSUFBWSxvQkFzQlg7QUF0QkQsV0FBWSxvQkFBb0I7SUFDOUIsaUVBQUssQ0FBQTtJQUNMLG1GQUFjLENBQUE7SUFDZCwyRkFBa0IsQ0FBQTtJQUNsQiw2RUFBVyxDQUFBO0lBQ1gsNkVBQVcsQ0FBQTtJQUNYLCtEQUFJLENBQUE7SUFDSixxRUFBTyxDQUFBO0lBQ1AscUVBQU8sQ0FBQTtJQUNQLGlFQUFLLENBQUE7SUFDTCxpRUFBSyxDQUFBO0lBQ0wsNEVBQVUsQ0FBQTtJQUNWLHdFQUFRLENBQUE7SUFDUixvRkFBYyxDQUFBO0lBQ2QsZ0ZBQVksQ0FBQTtJQUNaLDRGQUFrQixDQUFBO0lBQ2xCLHNFQUFPLENBQUE7SUFDUCx3RkFBZ0IsQ0FBQTtJQUNoQiw0RUFBVSxDQUFBO0lBQ1YsZ0ZBQVksQ0FBQTtJQUNaLGtFQUFLLENBQUE7SUFDTCxzRUFBTyxDQUFBO0FBQ1QsQ0FBQyxFQXRCVyxvQkFBb0IsS0FBcEIsb0JBQW9CLFFBc0IvQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIEtpbmVzY29wZVBsYXllckV2ZW50IHtcbiAgUmVhZHksXG4gIFF1YWxpdHlDaGFuZ2VkLFxuICBBdXRvUXVhbGl0eUNoYW5nZWQsXG4gIFNlZWtDaGFwdGVyLFxuICBTaXplQ2hhbmdlZCxcbiAgUGxheSxcbiAgUGxheWluZyxcbiAgV2FpdGluZyxcbiAgUGF1c2UsXG4gIEVuZGVkLFxuICBUaW1lVXBkYXRlLFxuICBQcm9ncmVzcyxcbiAgRHVyYXRpb25DaGFuZ2UsXG4gIFZvbHVtZUNoYW5nZSxcbiAgUGxheWJhY2tSYXRlQ2hhbmdlLFxuICBTZWVraW5nLFxuICBGdWxsc2NyZWVuQ2hhbmdlLFxuICBDYWxsQWN0aW9uLFxuICBDYWxsQm9va21hcmssXG4gIEVycm9yLFxuICBEZXN0cm95LFxufVxuIl19