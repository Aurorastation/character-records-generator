﻿using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AuroraRecordGenerator
{
    internal partial class RecordFormatter
    {
        private Record _targetRecord;

        public RecordFormatter(Record r)
        {
            _targetRecord = r;
            UpdateSplitRecords();
            MakeCommonRecords();
        }

        private IList<string> _medicalPublicRecord;
        private IList<string> _medicalHistory;
        private IList<string> _medicalNotes;
        private IList<string> _medicalPsychHistory;
        private IList<string> _medicalPsychNotes;
        private IList<string> _medicalPrescriptions;

        private IList<string> _securityPublicRecord;
        private IList<string> _securityRecords;
        private IList<string> _securityNotes;

        private IList<string> _employmentPublicRecord;
        private IList<string> _employmentExperience;
        private IList<string> _employmentFormalEducation;
        private IList<string> _employmentSkills;

        private void UpdateSplitRecords()
        {
            if (_targetRecord == null)
            {
                _targetRecord = new Record();
            }

            // Medical
            _medicalPublicRecord = _targetRecord.MedicalPublicRecord?.LineSplit();
            _medicalHistory = _targetRecord.MedicalHistory?.LineSplit();
            _medicalNotes = _targetRecord.MedicalNotes?.LineSplit();
            _medicalPsychHistory = _targetRecord.MedicalPsychHistory?.LineSplit();
            _medicalPsychNotes = _targetRecord.MedicalPsychNotes?.LineSplit();
            _medicalPrescriptions = _targetRecord.MedicalPrescriptions?.LineSplit();

            // security
            _securityPublicRecord = _targetRecord.SecurityPublicRecord?.LineSplit();
            _securityRecords = _targetRecord.SecurityRecords?.LineSplit();
            _securityNotes = _targetRecord.SecurityNotes?.LineSplit();

            // employment
            _employmentPublicRecord = _targetRecord.EmploymentPublicRecord?.LineSplit();
            _employmentExperience = _targetRecord.EmploymentExperience?.LineSplit();
            _employmentFormalEducation = _targetRecord.EmploymentFormalEducation?.LineSplit();
            _employmentSkills = _targetRecord.EmploymentSkills?.LineSplit();

            // flush the record cache so they're regenerated
            _commonRecords = null;
        }

        public string EmploymentRecords => MakeEmploymentRecords();
        public string MedicalRecords => MakeMedicalRecords();
        public string SecurityRecords => MakeSecurityRecords();

        private string _commonRecords;

        /// <summary>
        ///		Writes the <see cref="string"/> form of a record section to the specified <see cref="StringBuilder"/>, as long as there's entries to write.
        /// </summary>
        /// <param name="builder">The <see cref="StringBuilder"/> to write to.</param>
        /// <param name="header">The title for the section.</param>
        /// <param name="entries">The entries of this section.</param>
        private static void WriteSectionIfAny(ref StringBuilder builder, string header, IList<string> entries)
        {
            if (entries == null || !entries.Any() || entries[0].Trim().Length == 0)
                return;
            builder.AppendLine(header);
            builder.AppendLine(entries.FormatAsList());
        }

        private string MakeNameLine()
        {
            var builder = new StringBuilder("Name: ");
            builder.Append(_targetRecord.FirstName);
            builder.Append(_targetRecord.MiddleName.SpaceIfValue());
            builder.Append($" {_targetRecord.LastName}");
            builder.Append(_targetRecord.NameSuffix.SpaceIfValue());
            return builder.ToString();
        }

        private static void MakeMedicalNote(ref StringBuilder b, string s) =>
            b.AppendLine($" - {s}");
    }
}
