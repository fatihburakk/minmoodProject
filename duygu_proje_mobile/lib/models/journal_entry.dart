class JournalEntry {
  final String id;
  final String userId;
  final String title;
  final String content;
  final String emotion;
  final DateTime createdAt;

  JournalEntry({
    required this.id,
    required this.userId,
    required this.title,
    required this.content,
    required this.emotion,
    required this.createdAt,
  });

  factory JournalEntry.fromJson(Map<String, dynamic> json) {
    return JournalEntry(
      id: json['id'],
      userId: json['userId'],
      title: json['title'],
      content: json['content'],
      emotion: json['emotion'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'title': title,
      'content': content,
      'emotion': emotion,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
