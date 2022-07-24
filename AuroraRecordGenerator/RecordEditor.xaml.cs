﻿using MahApps.Metro.Controls.Dialogs;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace AuroraRecordGenerator
{
    /// <summary>
    /// Interaction logic for RecordEditor.xaml
    /// </summary>
    public partial class RecordEditor
    {
        public RecordEditor()
        {
            // Initialize the record object used for storage and generation
            Data = new Record();
            DataContext = Data;
            ProtoBuf.Serializer.PrepareSerializer<SpeciesType>();
            ProtoBuf.Serializer.PrepareSerializer<SpeciesSubType>();
            ProtoBuf.Serializer.PrepareSerializer<Record>();
            InitializeComponent();
            SubSpeciesCombo.ItemsSource = GetSpeciesOptions();
            VersionLabel.Content = $"v{Utility.GetVersion()}";
        }

        private Record Data { get; set; }
        private string _currentFilePath;

        private void SpeciesSelectChanged(object sender, SelectionChangedEventArgs e)
        {
            if (SpeciesCombo.SelectionBoxItem == null)
                return;

            var type = (SpeciesType)SpeciesCombo.SelectedValue;

            Debug.WriteLine("Updating subspecies types.");
            var types = GetSpeciesOptions(type);
            var itemsSource = types as IList<string> ?? types.ToList();
            SubSpeciesCombo.ItemsSource = itemsSource;
            Debug.WriteLine($"New types: {string.Join(",", itemsSource)}");
        }

        private void WindowLoaded(object sender, RoutedEventArgs e)
        {
            SpeciesCombo.SelectedIndex = 0;
        }

        private void GenerateRecord(object sender, RoutedEventArgs e)
        {
            // Update medical checkboxes.
            Data.NoBorg = NoBorg.IsChecked ?? false;
            Data.NoProsthetic = NoProsthetic.IsChecked ?? false;
            Data.NoRevive = NoRevive.IsChecked ?? false;

            // Figure out what subspecies we've got.
            var subspecies = SubSpeciesCombo.SelectedItem as string;
            Data.Subspecies = subspecies != null ? Utility.SubspeciesNiceNameToEnum(subspecies) : SpeciesSubType.None;

            // Figure out their species too.
            Data.Species = (SpeciesType)SpeciesCombo.SelectedValue;

            var wnd = new GeneratedResultWindow(Data);
            wnd.Show();
        }

        private async void SaveContent(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(_currentFilePath))
                SaveContentAs(null, null);
            else
            {
                // have a path, attempt to save to it
                if (!File.Exists(_currentFilePath))
                {
                    switch (
                        await
                            this.ShowMessageAsync("File Error",
                                "Current file missing, renamed, or deleted. Do you want to save as another name?",
                                MessageDialogStyle.AffirmativeAndNegative))
                    {
                        case MessageDialogResult.Negative:
                            _currentFilePath = null;
                            return;

                        case MessageDialogResult.Affirmative:
                            SaveContentAs(null, null);
                            return;

                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                }

                var fs = File.Open(_currentFilePath, FileMode.Truncate);
                ProtoBuf.Serializer.Serialize(fs, Data);
            }
        }

        private async void OpenContent(object sender, RoutedEventArgs e)
        {
            var dialog = new Microsoft.Win32.OpenFileDialog
            {
                AddExtension = true,
                CheckFileExists = true,
                CheckPathExists = true,
                Filter = "Character Profiles (*.ss13prof)|*.ss13prof|All Files (*.*)|*.*"
            };

            if (!(dialog.ShowDialog() ?? false)) return;

            var fs = File.Open(dialog.FileName, FileMode.Open);
            try
            {
                Data = ProtoBuf.Serializer.Deserialize<Record>(fs);
                _currentFilePath = dialog.FileName;
                // So WPF updates bindings
                DataContext = Data;
            }
            catch (ProtoBuf.ProtoException)
            {
                await this.ShowMessageAsync("Profile Error", "An error occurred during loading of your profile. You may have selected a file that is not a profile file, or the profile is corrupted.");
            }

        }

        private void SaveContentAs(object sender, RoutedEventArgs e)
        {
            var dialog = new Microsoft.Win32.SaveFileDialog
            {
                AddExtension = true,
                CheckPathExists = true,
                Filter = "Character Profiles (*.ss13prof)|*.ss13prof|All Files (*.*)|*.*"
            };
            if (!(dialog.ShowDialog() ?? false)) return;
            var fs = File.Open(dialog.FileName, FileMode.Create);
            ProtoBuf.Serializer.Serialize(fs, Data);
            _currentFilePath = dialog.FileName;
        }

        private static IEnumerable<string> GetSpeciesOptions() => Enum.GetValues(typeof(SpeciesSubType)).Cast<SpeciesSubType>().Select(Utility.SubspeciesNiceName);

        private static IEnumerable<string> GetSpeciesOptions(SpeciesType limitTo) => from item in Enum.GetValues(typeof(SpeciesSubType)).Cast<SpeciesSubType>()
                                                                                     let attr = item.GetAttributeOfType<SubspeciesMetaAttribute>()
                                                                                     where attr != null && (attr.AssociatedSpecies == limitTo || attr.AssociatedSpecies == SpeciesType.None)
                                                                                     select Utility.SubspeciesNiceName(item);
    }
}