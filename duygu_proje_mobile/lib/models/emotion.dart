class Emotion {
  final String id;
  final String userId;
  final String text;
  final String emotion;
  final double confidence;
  final DateTime createdAt;

  Emotion({
    required this.id,
    required this.userId,
    required this.text,
    required this.emotion,
    required this.confidence,
    required this.createdAt,
  });

  factory Emotion.fromJson(Map<String, dynamic> json) {
    return Emotion(
      id: json['id'],
      userId: json['userId'],
      text: json['text'],
      emotion: json['emotion'],
      confidence: json['confidence'].toDouble(),
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'text': text,
      'emotion': emotion,
      'confidence': confidence,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
