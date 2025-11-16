import FuseUtils from "@fuse/utils";
import { height } from "@mui/system";

class ChatMessageModel {
  constructor(chatId, message, replyMessageId = null, customer = {}) {
    // required identifiers
    this.messageId = FuseUtils.generateMessageUUID();
    this.chatId = chatId;
    this.customerId = customer.customerId || null;
    this.message = this.parseMessage(message.messageType, message);

    // reply context
    this.replyMessageId = replyMessageId || null;
    this.phoneNumber = customer.phoneNumber;

    this.messageTime = Date.now();
  }

  /**
   * Generic parser for supported message types
   */
  parseMessage(type, message) {
    switch (type) {
      case "text":
        return {
          messageType: "text",
          text: message?.text || "",
        };

      case "template":
        return {
          messageType: "template",
          templateMessage: {
            id: message?.templateMessage?.id || null,
            variables: message?.templateMessage?.variables || [],
            cardVariables: message?.templateMessage?.cardVariables || [],
          },
        };

      case "address":
        return {
          messageType: "address",
          address: message?.address || {},
        };

      case "audio":
      case "video":
      case "image":
      case "document":
        return {
          messageType: type,
          fileUrl: message?.fileUrl || null,
          mimeType: message?.mimeType || null,
          caption: message?.caption || null,
          size: message?.size || null,
          fileName: message?.fileName || null,
          height: message?.height || 300,
          width: message?.width || 300,
        };

      default:
        return {
          messageType: type,
          ...message,
        };
    }
  }

  /**
   * Convert model → temporary Redux/UI shape
   */
  toTempMessage(quote = null) {
    return {
      id: this.messageId,
      message: this.message,
      senderUser: [], // you can later fill with logged-in user details
      senderType: "USER", // or CUSTOMER depending on who sends
      replyMessage: quote
        ? {
            text: quote.preview,
            messageType: quote.type,
            authorName: quote.authorName,
          }
        : null,
      replyMessageId: quote ? quote.id : this.replyMessageId,
      messageMetadata: [],
      readCount: 0,
      deliveryCount: 0,
      erroredCount: 0,
      errorMessage: null,
      adReferralData: null,
      dateCreated: new Date(this.messageTime).toISOString(),
      dateUpdated: new Date(this.messageTime).toISOString(),
      totalCount: 1,
    };
  }
  
}

export default ChatMessageModel;
