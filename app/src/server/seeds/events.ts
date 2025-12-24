import { PrismaClient } from "@/generated/prisma";
import { Prefecture } from "@/shared/common/enums/prefecture.enum";
import { Reward } from "@/shared/common/enums/reward.enum";
import { addDays, addHours, createDate, getParts, now, TZ } from "@/utils/date";

const prisma = new PrismaClient();

type EventTemplate = {
  name: string;
  description: string | null;
  startHour: number;
  duration: number;
  capacity: number;
  prefecture: Prefecture;
  reward: Reward | null;
};

type Event = {
  name: string;
  description: string | null;
  eventStartDatetime: Date;
  eventEndDatetime: Date;
  capacity: number;
  prefecture: Prefecture;
  reward: Reward | null;
};

const eventTemplates = [
  {
    name: "React入門ワークショップ",
    description:
      "Reactの基礎から学ぶ実践的なワークショップ。コンポーネント設計や状態管理について理解を深めます。",
    startHour: 10,
    duration: 2,
    capacity: 30,
    prefecture: Prefecture.HOKKAIDO,
    reward: null,
  },
  {
    name: "TypeScript実践セミナー",
    description: "TypeScriptの型システムを活用した実践的な開発手法を学びます。",
    startHour: 14,
    duration: 2,
    capacity: 25,
    prefecture: Prefecture.AOMORI,
    reward: Reward.CASH,
  },
  {
    name: "Next.jsアプリケーション開発",
    description:
      "Next.jsを使ったモダンなWebアプリケーション開発の基礎から応用までを学びます。",
    startHour: 10,
    duration: 3,
    capacity: 40,
    prefecture: Prefecture.IWATE,
    reward: Reward.QUO_CARD,
  },
  {
    name: "Docker/Kubernetes基礎講座",
    description:
      "コンテナ技術の基礎からKubernetesによるオーケストレーションまでを実践的に学びます。",
    startHour: 13,
    duration: 2,
    capacity: 35,
    prefecture: Prefecture.MIYAGI,
    reward: Reward.POINT,
  },
  {
    name: "AWSクラウド入門",
    description:
      "AWSの主要サービスを使ったクラウドインフラ構築の基礎を学びます。",
    startHour: 10,
    duration: 2,
    capacity: 50,
    prefecture: Prefecture.AKITA,
    reward: null,
  },
  {
    name: "Python機械学習ハンズオン",
    description:
      "Pythonと機械学習ライブラリを使った実践的なデータ分析とモデル構築を体験します。",
    startHour: 14,
    duration: 3,
    capacity: 20,
    prefecture: Prefecture.YAMAGATA,
    reward: Reward.CASH,
  },
  {
    name: "GraphQL API設計",
    description: "GraphQLを使った効率的なAPI設計と実装方法を学びます。",
    startHour: 11,
    duration: 2,
    capacity: 30,
    prefecture: Prefecture.FUKUSHIMA,
    reward: Reward.QUO_CARD,
  },
  {
    name: "マイクロサービスアーキテクチャ",
    description:
      "マイクロサービスアーキテクチャの設計原則と実装パターンを学びます。",
    startHour: 15,
    duration: 2,
    capacity: 25,
    prefecture: Prefecture.IBARAKI,
    reward: Reward.POINT,
  },
  {
    name: "CI/CDパイプライン構築",
    description:
      "GitHub ActionsやJenkinsを使ったCI/CDパイプラインの構築方法を実践的に学びます。",
    startHour: 10,
    duration: 2,
    capacity: 30,
    prefecture: Prefecture.TOCHIGI,
    reward: null,
  },
  {
    name: "セキュリティベストプラクティス",
    description:
      "Webアプリケーションのセキュリティ対策とベストプラクティスを学びます。",
    startHour: 13,
    duration: 2,
    capacity: 40,
    prefecture: Prefecture.GUNMA,
    reward: Reward.CASH,
  },
  {
    name: "データベース設計基礎",
    description:
      "リレーショナルデータベースの設計原則と正規化について学びます。",
    startHour: 10,
    duration: 1,
    capacity: 35,
    prefecture: Prefecture.SAITAMA,
    reward: Reward.QUO_CARD,
  },
  {
    name: "フロントエンドパフォーマンス最適化",
    description:
      "Webアプリケーションのパフォーマンスを向上させる実践的な手法を学びます。",
    startHour: 14,
    duration: 2,
    capacity: 30,
    prefecture: Prefecture.CHIBA,
    reward: Reward.POINT,
  },
  {
    name: "バックエンドAPI開発",
    description:
      "RESTful APIの設計と実装、エラーハンドリングについて学びます。",
    startHour: 11,
    duration: 2,
    capacity: 25,
    prefecture: Prefecture.TOKYO,
    reward: null,
  },
  {
    name: "モバイルアプリ開発（React Native）",
    description:
      "React Nativeを使ったクロスプラットフォームモバイルアプリ開発を学びます。",
    startHour: 10,
    duration: 3,
    capacity: 20,
    prefecture: Prefecture.KANAGAWA,
    reward: Reward.CASH,
  },
  {
    name: "テスト駆動開発（TDD）",
    description:
      "テスト駆動開発の実践方法とユニットテスト、統合テストの書き方を学びます。",
    startHour: 15,
    duration: 2,
    capacity: 30,
    prefecture: Prefecture.NIIGATA,
    reward: Reward.QUO_CARD,
  },
  {
    name: "Git/GitHub実践",
    description:
      "Gitの高度な使い方とGitHubを使ったチーム開発のベストプラクティスを学びます。",
    startHour: 10,
    duration: 1,
    capacity: 40,
    prefecture: Prefecture.TOYAMA,
    reward: Reward.POINT,
  },
  {
    name: "デザインパターン入門",
    description:
      "オブジェクト指向設計における代表的なデザインパターンを学びます。",
    startHour: 13,
    duration: 2,
    capacity: 25,
    prefecture: Prefecture.ISHIKAWA,
    reward: null,
  },
  {
    name: "リアルタイムアプリケーション開発",
    description:
      "WebSocketを使ったリアルタイム通信アプリケーションの開発方法を学びます。",
    startHour: 14,
    duration: 2,
    capacity: 30,
    prefecture: Prefecture.FUKUI,
    reward: Reward.CASH,
  },
  {
    name: "サーバーレスアーキテクチャ",
    description:
      "AWS LambdaやVercel Functionsを使ったサーバーレスアプリケーションの構築を学びます。",
    startHour: 11,
    duration: 2,
    capacity: 35,
    prefecture: Prefecture.YAMANASHI,
    reward: Reward.QUO_CARD,
  },
  {
    name: "コンテナオーケストレーション",
    description:
      "Kubernetesを使ったコンテナオーケストレーションの実践的な運用方法を学びます。",
    startHour: 10,
    duration: 3,
    capacity: 20,
    prefecture: Prefecture.NAGANO,
    reward: Reward.POINT,
  },
  {
    name: "モノレポ開発手法",
    description:
      "TurborepoやNxを使ったモノレポ構成での効率的な開発手法を学びます。",
    startHour: 15,
    duration: 2,
    capacity: 30,
    prefecture: Prefecture.GIFU,
    reward: null,
  },
  {
    name: "アクセシビリティ対応",
    description: "Webアクセシビリティ（a11y）の基礎と実装方法を学びます。",
    startHour: 10,
    duration: 1,
    capacity: 40,
    prefecture: Prefecture.SHIZUOKA,
    reward: Reward.CASH,
  },
  {
    name: "パフォーマンスモニタリング",
    description:
      "APMツールを使ったアプリケーションのパフォーマンス監視と分析手法を学びます。",
    startHour: 13,
    duration: 2,
    capacity: 25,
    prefecture: Prefecture.AICHI,
    reward: Reward.QUO_CARD,
  },
  {
    name: "データ可視化技術",
    description:
      "D3.jsやChart.jsを使ったデータ可視化の実践的な手法を学びます。",
    startHour: 14,
    duration: 2,
    capacity: 30,
    prefecture: Prefecture.MIE,
    reward: Reward.POINT,
  },
  {
    name: "ブロックチェーン入門",
    description:
      "ブロックチェーンの基礎概念とスマートコントラクト開発の入門を学びます。",
    startHour: 10,
    duration: 2,
    capacity: 35,
    prefecture: Prefecture.SHIGA,
    reward: null,
  },
  {
    name: "DevOps実践",
    description:
      "インフラストラクチャのコード化（IaC）とDevOpsの実践的な手法を学びます。",
    startHour: 16,
    duration: 2,
    capacity: 30,
    prefecture: Prefecture.KYOTO,
    reward: Reward.CASH,
  },
  {
    name: "API設計のベストプラクティス",
    description:
      "RESTful APIとGraphQLの設計原則とベストプラクティスを学びます。",
    startHour: 11,
    duration: 1,
    capacity: 40,
    prefecture: Prefecture.OSAKA,
    reward: Reward.QUO_CARD,
  },
  {
    name: "フルスタック開発入門",
    description:
      "フロントエンドからバックエンドまで、フルスタック開発の基礎を学びます。",
    startHour: 10,
    duration: 3,
    capacity: 25,
    prefecture: Prefecture.HYOGO,
    reward: Reward.POINT,
  },
  {
    name: "クラウドネイティブ開発",
    description:
      "クラウドネイティブなアプリケーション開発の設計原則と実践方法を学びます。",
    startHour: 14,
    duration: 2,
    capacity: 30,
    prefecture: Prefecture.NARA,
    reward: null,
  },
  {
    name: "AI/MLアプリケーション統合",
    description:
      "機械学習モデルをWebアプリケーションに統合する実践的な手法を学びます。",
    startHour: 15,
    duration: 2,
    capacity: 20,
    prefecture: Prefecture.WAKAYAMA,
    reward: Reward.CASH,
  },
] as const satisfies EventTemplate[];

const today = now();
const events: Event[] = eventTemplates.map((template, index) => {
  // -5日からeventTemplates.length日間
  const daysOffset = index - 5;
  const eventDate = addDays(today, daysOffset);

  // 日付のUTC年、月、日を取得してUTC 0時のISO文字列を作成
  const { year, monthIndex, day } = getParts(eventDate, { timeZone: TZ.JST });
  const startDate = createDate({
    params: {
      year,
      monthIndex,
      day,
      hour: template.startHour,
    },
    options: {
      timeZone: TZ.JST,
    },
  });
  const endDate = addHours(startDate, template.duration);

  return {
    name: template.name,
    description: template.description,
    eventStartDatetime: startDate,
    eventEndDatetime: endDate,
    capacity: template.capacity,
    prefecture: template.prefecture,
    reward: template.reward,
  };
});

export const createEvents = async () => {
  await prisma.events.createMany({
    data: events.map((event) => ({
      name: event.name,
      description: event.description,
      eventStartDatetime: event.eventStartDatetime,
      eventEndDatetime: event.eventEndDatetime,
      capacity: event.capacity,
      prefecture: event.prefecture,
      reward: event.reward,
    })),
  });
};
