import 'dart:async';

/// Extension providing exact time-window throttling (e.g. 30Hz = 33ms window)
extension TimeThrottleExtension<T> on Stream<T> {
  Stream<T> throttleTime(Duration duration) {
    Timer? timer;
    T? latestData;
    bool hasTrailing = false;

    return transform(
      StreamTransformer<T, T>.fromHandlers(
        handleData: (data, sink) {
          latestData = data;
          if (timer == null || !timer!.isActive) {
            sink.add(data);
            timer = Timer(duration, () {
              if (hasTrailing && latestData != null) {
                sink.add(latestData as T);
                hasTrailing = false;
              }
            });
          } else {
            hasTrailing = true;
          }
        },
        handleDone: (sink) {
          timer?.cancel();
          sink.close();
        },
        handleError: (error, stack, sink) {
          sink.addError(error, stack);
        },
      ),
    );
  }
}
