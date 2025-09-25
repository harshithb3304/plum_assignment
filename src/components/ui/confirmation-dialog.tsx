'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Download, Save, X } from 'lucide-react';
import { WellnessTip } from '@/lib/types';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onExportPDF: () => void;
  title: string;
  description: string;
  favorites: WellnessTip[];
}

export function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onExportPDF,
  title, 
  description, 
  favorites 
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-white dark:bg-gray-900 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-lg font-semibold">
                {title}
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {favorites.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                You have {favorites.length} favorite tip{favorites.length > 1 ? 's' : ''}:
              </p>
              <div className="space-y-1">
                {favorites.slice(0, 3).map((tip, index) => (
                  <p key={index} className="text-xs text-blue-600 dark:text-blue-300 truncate">
                    • {tip.title}
                  </p>
                ))}
                {favorites.length > 3 && (
                  <p className="text-xs text-blue-500 dark:text-blue-400">
                    ... and {favorites.length - 3} more
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            {favorites.length > 0 && (
              <Button 
                variant="secondary" 
                onClick={onExportPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            )}
            <Button 
              onClick={onConfirm}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}