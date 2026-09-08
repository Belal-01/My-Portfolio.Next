'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_MESSAGES } from '@/lib/supabase/mockData';
import { Message } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages from Supabase:', error);
        setErrorMsg('Could not fetch messages from database. Showing fallback messages.');
        setMessages(MOCK_MESSAGES);
      } else if (data && data.length > 0) {
        setMessages(data as Message[]);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching inbox messages:', err);
      setErrorMsg('An unexpected error occurred while loading inbox messages.');
      setMessages(MOCK_MESSAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (ignore) return;

        if (error) {
          console.error('Error fetching messages from Supabase:', error);
          setErrorMsg('Could not fetch messages from database. Showing fallback messages.');
          setMessages(MOCK_MESSAGES);
        } else if (data && data.length > 0) {
          setMessages(data as Message[]);
        } else {
          setMessages([]);
        }
      } catch (err) {
        if (ignore) return;
        console.error('Unexpected error fetching inbox messages:', err);
        setErrorMsg('An unexpected error occurred while loading inbox messages.');
        setMessages(MOCK_MESSAGES);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const toggleReadStatus = async (id: string, currentReadStatus: boolean) => {
    const nextStatus = !currentReadStatus;
    setActionLoadingId(id);
    setErrorMsg(null);

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: nextStatus } : m))
    );

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('messages')
        .update({ is_read: nextStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating read status in Supabase:', error);
        setErrorMsg(`Failed to update status: ${error.message}`);
        // Revert optimistic update
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, is_read: currentReadStatus } : m))
        );
      }
    } catch (err) {
      console.error('Unexpected error updating read status:', err);
      setErrorMsg('Failed to update message status in Supabase.');
      // Revert optimistic update
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: currentReadStatus } : m))
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteMessage = async (id: string, senderName: string) => {
    if (!confirm(`Are you sure you want to delete message from "${senderName}"?`)) {
      return;
    }

    setActionLoadingId(id);
    setErrorMsg(null);

    // Optimistic delete
    const prevMessages = [...messages];
    setMessages((prev) => prev.filter((m) => m.id !== id));

    try {
      const supabase = createClient();
      const { error } = await supabase.from('messages').delete().eq('id', id);

      if (error) {
        console.error('Error deleting message from Supabase:', error);
        setErrorMsg(`Failed to delete message: ${error.message}`);
        setMessages(prevMessages);
      }
    } catch (err) {
      console.error('Unexpected error deleting message:', err);
      setErrorMsg('Failed to delete message from Supabase.');
      setMessages(prevMessages);
    } finally {
      setActionLoadingId(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-indigo-400" />
            Inbox Messages
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Read and manage contact form submissions directly from Supabase.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          disabled={loading}
          className="self-start sm:self-auto bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white text-xs gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Inbox
        </Button>
      </div>

      {errorMsg && (
        <Alert className="bg-rose-950/40 border-rose-800/50 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-3 glass-card rounded-2xl border-purple-500/20">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Fetching messages from Supabase...</p>
        </div>
      ) : messages.length === 0 ? (
        <Card className="glass-card border-purple-500/20 bg-slate-950/60 p-12 text-center text-slate-400 space-y-3">
          <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-200">Inbox is empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No contact form submissions have been received in your database yet.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages.map((message) => {
            const isProcessing = actionLoadingId === message.id;

            return (
              <Card
                key={message.id}
                className={`glass-card border-purple-500/20 bg-slate-950/60 p-5 transition-all ${
                  !message.is_read ? 'border-l-4 border-l-purple-500 bg-purple-950/20' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-slate-100 flex items-center gap-1.5 text-sm">
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        {message.sender_name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        &lt;{message.sender_email}&gt;
                      </span>
                      {!message.is_read && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 whitespace-pre-wrap">
                      {message.message}
                    </p>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(message.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => toggleReadStatus(message.id, message.is_read)}
                      className="bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white cursor-pointer text-xs gap-1.5"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : message.is_read ? (
                        <>
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> Mark Unread
                        </>
                      ) : (
                        <>
                          <MailOpen className="w-3.5 h-3.5 text-purple-400" /> Mark Read
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => deleteMessage(message.id, message.sender_name)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/30 cursor-pointer text-xs"
                      title="Delete Message"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


