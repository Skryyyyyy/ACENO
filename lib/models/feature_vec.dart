import 'dart:typed_data';

class FeatureVec {
  static const int dimension = 76;
  final Float32List values;

  FeatureVec(this.values) {
    if (values.length != dimension) {
      throw ArgumentError('FeatureVec must have exactly $dimension elements, got ${values.length}');
    }
  }

  factory FeatureVec.zeros() => FeatureVec(Float32List(dimension));

  List<double> get lpcc => values.sublist(0, 20);
  List<double> get mfcc => values.sublist(20, 33);
  List<double> get peakFreqs => values.sublist(33, 37);
  List<double> get peakAmps => values.sublist(37, 41);
  List<double> get peakQs => values.sublist(41, 45);
  double get decayT20 => values[45];
  double get spectralCentroid => values[46];
  double get spectralRolloff => values[47];
  List<double> get accelPsdFreqs => values.sublist(48, 52);
  List<double> get accelPsdAmps => values.sublist(52, 56);
  double get accelRms => values[56];
  double get accelMicCoherence => values[57];

  List<double> toList() => values.toList();
}
