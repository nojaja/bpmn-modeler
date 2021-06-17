/**
 * This is a sample file that should be replaced with the actual translation.
 *
 * Checkout https://github.com/bpmn-io/bpmn-js-i18n for a list of available
 * translations and labels to translate.
 */
 export default {

  // Labels
  'Activate the global connect tool': 'アクティビティ接続ツール',
  'Append {type}': '{type}を追加',
  'Add Lane above': '上部にレーン追加',
  'Divide into two Lanes': 'レーンを2分割',
  'Divide into three Lanes': 'レーンを3分割',
  'Add Lane below': '下部にレーン追加',
  'Append compensation activity': '補正アクティビティの追加',
  'Change type': 'タイプの変更',
  'Connect using Association': '関連に接続',
  'Connect using Sequence/MessageFlow or Association': 'シーケンス/ MessageFlowや関連を使用して接続',
  'Connect using DataInputAssociation': 'DataInputAssociationを使用して接続',
  'Remove': '削除',
  'Activate the hand tool': 'ハンドツール',
  'Activate the lasso tool': '選択ツール',
  'Activate the create/remove space tool': '作成/削除スペースツールを有効',
  'Create expanded SubProcess': '展開可能なサブプロセスを作成',
  'Create IntermediateThrowEvent/BoundaryEvent': 'IntermediateThrowEvent / BoundaryEventを作成',
  'Create Pool/Participant': 'スイムレーン作成',
  'Parallel Multi Instance': '並列マルチインスタンス',
  'Sequential Multi Instance': 'シーケンシャルマルチインスタンス',
  'Loop': 'ループ',
  'Ad-hoc': 'アドホック',
  'Create {type}': '{type}の作成',
  'Task': 'タスク',
  'Send Task': 'タスクを送信',
  'Receive Task': 'タスクを受信',
  'User Task': 'ユーザー・タスク',
  'Manual Task': '手動タスク',
  'Business Rule Task': 'ビジネスルールタスク',
  'Service Task': 'サービスタスク',
  'Script Task': 'スクリプトタスク',
  'Call Activity': 'アクティビティ呼び出し',
  'Sub Process (collapsed)': 'サブプロセス（閉じる）',
  'Sub Process (expanded)': 'サブプロセス（展開）',
  'Start Event': '開始イベント',
  'Intermediate Throw Event': '中継イベント',
  'End Event': '終了イベント',
  'Message Start Event': 'メッセージ受信イベント',
  'Timer Start Event': 'タイマーイベント',
  'Conditional Start Event': '条件付き開始イベント',
  'Signal Start Event': 'シグナル受信イベント',
  'Error Start Event': 'エラー開始イベント',
  'Escalation Start Event': 'エスカレーション開始イベント',
  'Compensation Start Event': '補正開始イベント',
  'Message Start Event (non-interrupting)': 'メッセージ受信イベント（非中断）',
  'Timer Start Event (non-interrupting)': 'タイマーイベント（非中断）',
  'Conditional Start Event (non-interrupting)': '条件付き開始イベント（非中断）',
  'Signal Start Event (non-interrupting)': 'シグナル開始イベント（非中断）',
  'Escalation Start Event (non-interrupting)': 'エスカレーション開始イベント（非中断）',
  'Message Intermediate Catch Event': 'メッセージ中継キャッチイベント',
  'Message Intermediate Throw Event': 'メッセージ中継スローイベント',
  'Timer Intermediate Catch Event': 'タイマー中継キャッチイベント',
  'Escalation Intermediate Throw Event': 'エスカレーション中継スローイベント',
  'Conditional Intermediate Catch Event': '条件付き中継キャッチイベント',
  'Link Intermediate Catch Event': 'リンク中継キャッチイベント',
  'Link Intermediate Throw Event': 'リンク中継スローイベント',
  'Compensation Intermediate Throw Event': '補正中継スローイベント',
  'Signal Intermediate Catch Event': 'シグナル中継キャッチイベント',
  'Signal Intermediate Throw Event': 'シグナル中継スローイベント',
  'Message End Event': 'メッセージ送信終了イベント',
  'Escalation End Event': 'エスカレーション終了イベント',
  'Error End Event': 'エラー終了イベント',
  'Cancel End Event': '終了イベントをキャンセル',
  'Compensation End Event': '補正終了イベント',
  'Signal End Event': 'シグナル終了イベント',
  'Terminate End Event': '中断イベント',
  'Message Boundary Event': 'メッセージ境界イベント',
  'Message Boundary Event (non-interrupting)': 'メッセージ境界イベント（非中断）',
  'Timer Boundary Event': 'タイマー境界イベント',
  'Timer Boundary Event (non-interrupting)': 'タイマー境界イベント（非中断）',
  'Escalation Boundary Event': 'エスカレーション境界イベント',
  'Escalation Boundary Event (non-interrupting)': 'エスカレーション境界イベント（非中断）',
  'Conditional Boundary Event': '条件付き境界イベント',
  'Conditional Boundary Event (non-interrupting)': '条件付き境界イベント（非中断）',
  'Error Boundary Event': 'エラー境界イベント',
  'Cancel Boundary Event': '境界イベントをキャンセル',
  'Signal Boundary Event': 'シグナル境界イベント',
  'Signal Boundary Event (non-interrupting)': 'シグナル境界イベント（非中断）',
  'Compensation Boundary Event': '報酬境界イベント',
  'Exclusive Gateway': '排他型ゲートウェイ',
  'Parallel Gateway': '並列型ゲートウェイ',
  'Inclusive Gateway': '包含型ゲートウェイ',
  'Complex Gateway': '複合型ゲートウェイ',
  'Event based Gateway': 'イベントベースのゲートウェイ',
  'Transaction': 'トランザクション',
  'Sub Process': 'サブプロセス',
  'Event Sub Process': 'イベントサブプロセス',
  'Collapsed Pool': 'スイムレーン（閉じる）',
  'Expanded Pool': 'スイムレーン（展開）',

  // Errors
  'no parent for {element} in {parent}': '{parent}に {element} 要素が無い',
  'no shape type specified': '未定義のshapeが指定された',
  'flow elements must be children of pools/participants': 'この要素は、プールかレーン配下に配置してください',
  'out of bounds release': '境界リリースのうち',
  'more than {count} child lanes': ' {count} 回レーンより',
  'element required': '要素は必須',
  'diagram not part of bpmn:Definitions': 'ダイアグラムがbpmn:Definitionsの一部ではない',
  'no diagram to display': 'ダイアグラムが表示できません',
  'no process or collaboration to display': 'no process or collaboration to display',
  'element {element} referenced by {referenced}#{property} not yet drawn': 'element {element} referenced by {referenced}#{property} not yet drawn',
  'already rendered {element}': 'already rendered {element}',
  'failed to import {element}': 'failed to import {element}'
};